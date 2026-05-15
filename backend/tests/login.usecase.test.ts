import { describe, expect, it } from 'vitest';

import { LoginUseCase, type PasswordHasher, type TokenService } from '../src/features/v1/auth/login/login.usecase';
import type { UserRepository } from '../src/shared/ports/user.repository';

type StoredUser = {
    user_id: number;
    name: string;
    email: string;
    password: string;
};

class InMemoryUserRepository implements UserRepository {
    constructor(private readonly user: StoredUser | null) { }

    async findByEmail(): Promise<{ user_id: number; email: string } | null> {
        if (!this.user) return null;
        return { user_id: this.user.user_id, email: this.user.email };
    }

    async findByEmailWithPassword(): Promise<StoredUser | null> {
        return this.user;
    }

    async create(data: { name: string; email: string; password: string }) {
        return {
            user_id: this.user?.user_id ?? 1,
            name: data.name,
            email: data.email,
        };
    }
}

describe('LoginUseCase', () => {
    it('returns access and refresh tokens for valid credentials', async () => {
        const userRepository = new InMemoryUserRepository({
            user_id: 7,
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'hashed:secret',
        });

        const passwordHasher: PasswordHasher = {
            async compare(password: string, hashedPassword: string) {
                return password === 'supersecret' && hashedPassword === 'hashed:secret';
            },
        };

        const tokenService: TokenService = {
            async issueAccessToken() {
                return 'access-token';
            },
            async issueRefreshToken() {
                return { token: 'refresh-token', expiresAt: new Date('2026-05-16T00:00:00.000Z') };
            },
        };

        const useCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

        const result = await useCase.execute({
            email: 'stezi@example.com',
            password: 'supersecret',
        });

        expect(result).toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            user: {
                user_id: 7,
                name: 'Stezi',
                email: 'stezi@example.com',
            },
        });
    });

    it('rejects invalid credentials', async () => {
        const userRepository = new InMemoryUserRepository({
            user_id: 7,
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'hashed:secret',
        });

        const passwordHasher: PasswordHasher = {
            async compare() {
                return false;
            },
        };

        const tokenService: TokenService = {
            async issueAccessToken() {
                return 'access-token';
            },
            async issueRefreshToken() {
                return { token: 'refresh-token', expiresAt: new Date('2026-05-16T00:00:00.000Z') };
            },
        };

        const useCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

        await expect(
            useCase.execute({
                email: 'stezi@example.com',
                password: 'wrong-password',
            }),
        ).rejects.toThrow('Invalid credentials.');
    });

    it('rejects unknown user emails', async () => {
        const userRepository = new InMemoryUserRepository(null);

        const passwordHasher: PasswordHasher = {
            async compare() {
                return true;
            },
        };

        const tokenService: TokenService = {
            async issueAccessToken() {
                return 'access-token';
            },
            async issueRefreshToken() {
                return { token: 'refresh-token', expiresAt: new Date('2026-05-16T00:00:00.000Z') };
            },
        };

        const useCase = new LoginUseCase(userRepository, passwordHasher, tokenService);

        await expect(
            useCase.execute({
                email: 'missing@example.com',
                password: 'supersecret',
            }),
        ).rejects.toThrow('Invalid credentials.');
    });
});
