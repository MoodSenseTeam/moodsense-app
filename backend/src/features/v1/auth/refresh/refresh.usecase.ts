import type { RefreshTokenDto } from './refresh.dto';
import type { UserRepository } from '@/shared/ports/user.repository';
import type { TokenService } from '../login/login.usecase';

export type RefreshResult = {
    accessToken: string;
    refreshToken: string;
    user: { user_id: number; name: string; email: string };
};

type RefreshPayload = {
    sub?: string | number;
    email?: string;
};

export class RefreshUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) { }

    async execute(input: RefreshTokenDto): Promise<RefreshResult> {
        const payload = (await this.tokenService.verifyRefreshToken?.(input.refreshToken)) as RefreshPayload | null;

        if (!payload?.sub || !payload.email) {
            throw new Error('Invalid refresh token.');
        }

        const userId = Number(payload.sub);
        if (!Number.isFinite(userId)) {
            throw new Error('Invalid refresh token.');
        }

        const credentials = await this.userRepository.findCredentialsByUserId?.(userId);
        if (!credentials || !credentials.is_active || credentials.refresh_token !== input.refreshToken) {
            throw new Error('Invalid refresh token.');
        }

        if (credentials.token_expires && credentials.token_expires.getTime() <= Date.now()) {
            throw new Error('Refresh token expired.');
        }

        const user = await this.userRepository.findByEmailWithPassword(payload.email);
        if (!user) {
            throw new Error('Invalid refresh token.');
        }

        const accessToken = await this.tokenService.issueAccessToken({
            sub: user.user_id,
            email: user.email,
        });

        const { token: refreshToken, expiresAt } = await this.tokenService.issueRefreshToken({
            sub: user.user_id,
            email: user.email,
        });

        await this.userRepository.upsertCredentials?.(user.user_id, refreshToken, expiresAt);

        return {
            accessToken,
            refreshToken,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
            },
        };
    }
}
