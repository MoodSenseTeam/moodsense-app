import type { LogoutDto } from './logout.dto';
import type { UserRepository } from '@/shared/ports/user.repository';
import type { TokenService } from '@/infrastructure/security/token-service';
import { verifyRefreshToken } from '@/shared/utils/verify-refresh-token';

export class LogoutUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) { }

    async execute(input: LogoutDto): Promise<{ message: string }> {
        const { userId } = await verifyRefreshToken(this.tokenService, this.userRepository, input.refreshToken);

        await this.userRepository.revokeCredentials(userId);

        return { message: 'Logged out successfully' };
    }
}
