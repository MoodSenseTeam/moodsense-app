import type { CreateCheckinDto, CreatedCheckinDto } from './checkin.dto';
import type { CheckinRepository } from '@/shared/ports/checkin.repository';

export class CreateCheckinUseCase {
    constructor(private readonly checkinRepository: CheckinRepository) {}

    async execute(
        userId: number,
        input: CreateCheckinDto,
    ): Promise<CreatedCheckinDto> {
        const alreadyCheckedIn =
            await this.checkinRepository.hasCheckinToday(userId);

        if (alreadyCheckedIn) {
            throw new Error('You have already checked in today');
        }

        return this.checkinRepository.create(userId, input);
    }
}
