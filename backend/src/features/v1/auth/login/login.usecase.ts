import type { LoginUserDto } from './login.dto';
import type { UserRepository } from '@/shared/ports/user.repository';

export interface PasswordHasher {
    compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface TokenService {
    issueAccessToken(payload: object): Promise<string>;
    /** returns token string and expiry date */
    issueRefreshToken(payload: object): Promise<{ token: string; expiresAt: Date }>;
    verifyRefreshToken?(token: string): Promise<object | null>;
    verifyAccessToken?(token: string): Promise<object | null>;
}

export type LoginResult = {
    accessToken: string;
    refreshToken: string;
    user: { user_id: number; name: string; email: string };
};

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
        private readonly tokenService: TokenService,
    ) { }

    public async execute(input: LoginUserDto): Promise<LoginResult> {
        const existingUser = await this.userRepository.findByEmailWithPassword(input.email);

        if (!existingUser) {
            throw new Error('Invalid credentials.');
        }

        const passwordMatch = await this.passwordHasher.compare(input.password, existingUser.password);
        if (!passwordMatch) {
            throw new Error('Invalid credentials.');
        }

        const accessToken = await this.tokenService.issueAccessToken({
            sub: existingUser.user_id,
            email: existingUser.email,
        });

        const { token: refreshToken, expiresAt } = await this.tokenService.issueRefreshToken({
            sub: existingUser.user_id,
            email: existingUser.email,
        });

        if (this.userRepository.upsertCredentials) {
            try {
                await this.userRepository.upsertCredentials(existingUser.user_id, refreshToken, expiresAt);
            } catch {
                // Intentionally swallow persistence errors for now; log in production.
            }
        }

        if (this.userRepository.updateLastLogin) {
            try {
                await this.userRepository.updateLastLogin(existingUser.user_id, new Date());
            } catch {
            }
        }

        return {
            accessToken,
            refreshToken,
            user: {
                user_id: existingUser.user_id,
                name: existingUser.name,
                email: existingUser.email,
            },
        };
    }
}