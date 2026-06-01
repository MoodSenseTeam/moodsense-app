import type {
    CreateCheckinDto,
    CreatedCheckinDto,
} from '@/features/v1/dashboard/checkin/checkin.dto';

export interface CheckinRepository {
    create(userId: number, data: CreateCheckinDto): Promise<CreatedCheckinDto>;
    hasCheckinToday(userId: number): Promise<boolean>;
}
