import type { ChangePasswordDto } from './change-password.dto';
import type { UserRepository } from '@/shared/ports/user.repository';
import type { PasswordHasher } from '@/infrastructure/security/password-hasher';

export class ChangePasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async execute(userId: number, input: ChangePasswordDto) {
        const user = await this.userRepository.findByIdWithPassword(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await this.passwordHasher.compare(
            input.currentPassword,
            user.password,
        );
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const hashedNewPassword = await this.passwordHasher.hash(
            input.newPassword,
        );

        await this.userRepository.updatePassword(userId, hashedNewPassword);
    }
}
