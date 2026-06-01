import { describe, expect, it, vi } from 'vitest';
import { RefreshUseCase } from '../src/features/v1/auth/refresh/refresh.usecase';
import { LogoutUseCase } from '../src/features/v1/auth/logout/logout.usecase';
import { MeController } from '../src/features/v1/auth/me/me.controller';
import type { TokenService } from '../src/infrastructure/security/token-service';
import type { UserRepository } from '../src/shared/ports/user.repository';

type StoredUser = {
    user_id: number;
    name: string;
    email: string;
    password: string;
    gender: string;
    tanggal_lahir: string;
    usage_reason: string | null;
};

type StoredCredentials = {
    user_id: number;
    refresh_token: string | null;
    token_expires: Date | null;
    is_active: boolean;
};

function makeTokenService(overrides: Partial<TokenService> = {}): TokenService {
    return {
        issueAccessToken: async () => 'access-token',
        issueRefreshToken: async () => {
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            return { token: 'refresh-token', expiresAt };
        },
        verifyRefreshToken: async () => null,
        verifyAccessToken: async () => null,
        ...overrides,
    };
}

class InMemoryUserRepository implements UserRepository {
    public users: StoredUser[] = [];
    public credentials: StoredCredentials[] = [];

    async findByEmail(email: string) {
        const user = this.users.find((user) => user.email === email);
        if (!user) return null;
        return { user_id: user.user_id, name: user.name, email: user.email };
    }

    async findByEmailWithPassword(email: string) {
        return this.users.find((user) => user.email === email) ?? null;
    }

    async create(data: {
        name: string;
        email: string;
        password: string;
        gender: string;
        tanggal_lahir: string;
        usage_reason?: string;
    }) {
        const user: StoredUser = {
            user_id: this.users.length + 1,
            name: data.name,
            email: data.email,
            password: data.password,
            gender: data.gender,
            tanggal_lahir: data.tanggal_lahir,
            usage_reason: data.usage_reason ?? null,
        };

        this.users.push(user);

        return {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
        };
    }

    async upsertCredentials(
        userId: number,
        refreshToken: string,
        expiresAt: Date,
    ) {
        const existing = this.credentials.find(
            (item) => item.user_id === userId,
        );
        if (existing) {
            existing.refresh_token = refreshToken;
            existing.token_expires = expiresAt;
            existing.is_active = true;
            return;
        }

        this.credentials.push({
            user_id: userId,
            refresh_token: refreshToken,
            token_expires: expiresAt,
            is_active: true,
        });
    }

    async updateLastLogin() {
        return;
    }

    async findCredentialsByUserId(userId: number) {
        return this.credentials.find((item) => item.user_id === userId) ?? null;
    }

    async revokeCredentials(userId: number) {
        const existing = this.credentials.find(
            (item) => item.user_id === userId,
        );
        if (!existing) return;
        existing.refresh_token = null;
        existing.token_expires = null;
        existing.is_active = false;
    }
}

describe('Auth lifecycle', () => {
    it('rotates refresh token on refresh', async () => {
        const userRepository = new InMemoryUserRepository();
        userRepository.users.push({
            user_id: 1,
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'hashed:secret',
            gender: 'MALE',
            tanggal_lahir: '2000-01-01',
            usage_reason: null,
        });
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        userRepository.credentials.push({
            user_id: 1,
            refresh_token: 'refresh-token',
            token_expires: futureDate,
            is_active: true,
        });

        const tokenService = makeTokenService({
            issueAccessToken: async () => 'new-access-token',
            issueRefreshToken: async () => ({
                token: 'new-refresh-token',
                expiresAt: futureDate,
            }),
            verifyRefreshToken: async (token: string) =>
                token === 'refresh-token'
                    ? { sub: 1, email: 'stezi@example.com' }
                    : null,
        });

        const useCase = new RefreshUseCase(userRepository, tokenService);
        const result = await useCase.execute({ refreshToken: 'refresh-token' });

        expect(result).toEqual({
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            user: {
                user_id: 1,
                name: 'Stezi',
                email: 'stezi@example.com',
            },
        });
        expect(userRepository.credentials[0]?.refresh_token).toBe(
            'new-refresh-token',
        );
    });

    it('rejects invalid refresh tokens', async () => {
        const userRepository = new InMemoryUserRepository();

        const tokenService = makeTokenService({
            issueAccessToken: async () => 'new-access-token',
        });

        const useCase = new RefreshUseCase(userRepository, tokenService);

        await expect(
            useCase.execute({ refreshToken: 'bad-refresh-token' }),
        ).rejects.toThrow('Invalid refresh token.');
    });

    it('revokes refresh token on logout', async () => {
        const userRepository = new InMemoryUserRepository();
        userRepository.credentials.push({
            user_id: 1,
            refresh_token: 'refresh-token',
            token_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            is_active: true,
        });

        const tokenService = makeTokenService({
            verifyRefreshToken: async (token: string) =>
                token === 'refresh-token'
                    ? { sub: 1, email: 'stezi@example.com' }
                    : null,
        });

        const useCase = new LogoutUseCase(userRepository, tokenService);
        const result = await useCase.execute({ refreshToken: 'refresh-token' });

        expect(result).toEqual({ message: 'Logged out successfully' });
        expect(userRepository.credentials[0]?.is_active).toBe(false);
        expect(userRepository.credentials[0]?.refresh_token).toBeNull();
    });

    it('rejects invalid logout tokens', async () => {
        const userRepository = new InMemoryUserRepository();

        const tokenService = makeTokenService();

        const useCase = new LogoutUseCase(userRepository, tokenService);

        await expect(
            useCase.execute({ refreshToken: 'bad-refresh-token' }),
        ).rejects.toThrow('Invalid refresh token.');
    });

    it('returns current user from bearer token', async () => {
        const userRepository = new InMemoryUserRepository();
        userRepository.users.push({
            user_id: 1,
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'hashed:secret',
            gender: 'MALE',
            tanggal_lahir: '2000-01-01',
            usage_reason: null,
        });

        const tokenService = makeTokenService({
            verifyAccessToken: async (token: string) =>
                token === 'access-token'
                    ? { sub: 1, email: 'stezi@example.com' }
                    : null,
        });

        const controller = new MeController(userRepository, tokenService);
        const status = vi.fn().mockReturnThis();
        const json = vi.fn();

        await controller.handle(
            {
                header(name: string) {
                    return name === 'authorization'
                        ? 'Bearer access-token'
                        : undefined;
                },
            } as never,
            { status, json } as never,
        );

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            message: 'Current user fetched successfully',
            data: {
                user_id: 1,
                name: 'Stezi',
                email: 'stezi@example.com',
            },
        });
    });

    it('rejects missing access token on me endpoint', async () => {
        const userRepository = new InMemoryUserRepository();

        const tokenService = makeTokenService();

        const controller = new MeController(userRepository, tokenService);
        const status = vi.fn().mockReturnThis();
        const json = vi.fn();

        await controller.handle(
            {
                header() {
                    return undefined;
                },
            } as never,
            { status, json } as never,
        );

        expect(status).toHaveBeenCalledWith(401);
        expect(json).toHaveBeenCalledWith({ message: 'Missing access token' });
    });
});
