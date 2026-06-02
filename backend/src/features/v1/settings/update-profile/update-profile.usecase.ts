import type { UpdateProfileDto } from './update-profile.dto';
import type { UserRepository } from '@/shared/ports/user.repository';

export class UpdateProfileUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(userId: number, input: UpdateProfileDto) {
        const updateData: Record<string, unknown> = {};

        if (input.name !== undefined) {
            updateData.name = input.name;
        }

        if (input.gender !== undefined) {
            updateData.gender = input.gender;
        }

        if (input.tanggal_lahir !== undefined) {
            updateData.tanggal_lahir = new Date(input.tanggal_lahir);
        }

        if (input.usage_reason !== undefined) {
            updateData.usage_reason = input.usage_reason;
        }

        return this.userRepository.updateUser(userId, updateData);
    }
}
