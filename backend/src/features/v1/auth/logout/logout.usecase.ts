import type { LogoutDto } from './logout.dto';
import type { UserRepository } from '@/shared/ports/user.repository';
import type { TokenService } from '../login/login.usecase';

type LogoutPayload = {
    sub?: string | number;
    email?: string;
};

export class LogoutUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) { }

    async execute(input: LogoutDto): Promise<{ message: string }> {
        const payload = (await this.tokenService.verifyRefreshToken?.(input.refreshToken)) as LogoutPayload | null;

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

        await this.userRepository.revokeCredentials?.(userId);

        return { message: 'Logged out successfully' };
    }
}
