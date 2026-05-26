import type { RefreshTokenDto } from './refresh.dto';
import type { UserRepository } from '@/shared/ports/user.repository';
import type { TokenService } from '@/infrastructure/security/token-service';
import { verifyRefreshToken } from '@/shared/utils/verify-refresh-token';

type RefreshResult = {
    accessToken: string;
    refreshToken: string;
    user: { user_id: number; name: string; email: string };
};

export class RefreshUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) {}

    async execute(input: RefreshTokenDto): Promise<RefreshResult> {
        const { email, credentials } = await verifyRefreshToken(
            this.tokenService,
            this.userRepository,
            input.refreshToken,
        );

        if (
            credentials.token_expires &&
            credentials.token_expires.getTime() <= Date.now()
        ) {
            throw new Error('Refresh token expired.');
        }

        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Invalid refresh token.');
        }

        const accessToken = await this.tokenService.issueAccessToken({
            sub: user.user_id,
            email: user.email,
        });

        const { token: refreshToken, expiresAt } =
            await this.tokenService.issueRefreshToken({
                sub: user.user_id,
                email: user.email,
            });

        await this.userRepository.upsertCredentials(
            user.user_id,
            refreshToken,
            expiresAt,
        );

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
