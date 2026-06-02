import type {
    CreateCheckinDto,
    CreatedCheckinDto,
} from '@/features/v1/dashboard/checkin/checkin.dto';

export interface CheckinRepository {
    create(
        userId: number,
        data: CreateCheckinDto,
        prediction: {
            mood_result: 'STRESS' | 'HAPPY' | 'NORMAL';
            confidence_score: number;
            activity_suggestion: string;
        }
    ): Promise<CreatedCheckinDto>;
    hasCheckinToday(userId: number): Promise<boolean>;
    getHistory(userId: number): Promise<CreatedCheckinDto[]>;
}
