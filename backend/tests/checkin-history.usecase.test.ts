import { describe, expect, it, vi } from 'vitest';
import { GetCheckinHistoryUseCase } from '../src/features/v1/dashboard/checkin/checkin-history.usecase';
import type { CreatedCheckinDto } from '../src/features/v1/dashboard/checkin/checkin.dto';
import type { CheckinRepository } from '../src/shared/ports/checkin.repository';

const mockHistory: CreatedCheckinDto[] = [
    {
        log_id: 2,
        user_id: 15,
        sleep_hours: 8,
        activity_level: 'HIGH',
        study_hours: 6,
        social_score: 8,
        how_you_feeling: 'HAPPY',
        notes: 'Had a wonderful day',
        logged_at: '2026-05-28T10:00:00.000Z',
        created_at: '2026-05-28T10:00:00.000Z',
        prediction: {
            mood_result: 'HAPPY',
            confidence_score: 0.95,
            activity_suggestion: 'Luar biasa! Salurkan energi positifmu...',
        },
    },
    {
        log_id: 1,
        user_id: 15,
        sleep_hours: 7.5,
        activity_level: 'MODERATE',
        study_hours: 4,
        social_score: 6,
        how_you_feeling: 'NORMAL',
        notes: 'Felt good today',
        logged_at: '2026-05-27T10:00:00.000Z',
        created_at: '2026-05-27T10:00:00.000Z',
    },
];

describe('GetCheckinHistoryUseCase', () => {
    it('retrieves user log history successfully', async () => {
        const repository: CheckinRepository = {
            create: vi.fn(),
            hasCheckinToday: vi.fn(),
            getHistory: vi.fn().mockResolvedValue(mockHistory),
        };

        const useCase = new GetCheckinHistoryUseCase(repository);
        const result = await useCase.execute(15);

        expect(result).toEqual(mockHistory);
        expect(repository.getHistory).toHaveBeenCalledWith(15);
    });
});
