import type { CreatedCheckinDto } from './checkin.dto';
import type { CheckinRepository } from '@/shared/ports/checkin.repository';

export class GetCheckinHistoryUseCase {
    constructor(private readonly checkinRepository: CheckinRepository) {}

    async execute(userId: number): Promise<CreatedCheckinDto[]> {
        return this.checkinRepository.getHistory(userId);
    }
}
