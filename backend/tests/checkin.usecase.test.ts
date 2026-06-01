import { describe, expect, it, vi } from 'vitest';

import { CreateCheckinUseCase } from '../src/features/v1/dashboard/checkin/checkin.usecase';
import type { CreatedCheckinDto } from '../src/features/v1/dashboard/checkin/checkin.dto';
import type { CheckinRepository } from '../src/shared/ports/checkin.repository';
import type { PredictionService } from '../src/shared/ports/prediction-service';

const validInput = {
    sleep_hours: 7.5,
    activity_level: 'MODERATE' as const,
    study_hours: 4,
    social_score: 6,
    how_you_feeling: 'NORMAL' as const,
    notes: 'Felt good today',
};

const createdCheckin: CreatedCheckinDto = {
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
    prediction: {
        mood_result: 'NORMAL',
        confidence_score: 0.85,
        activity_suggestion: 'Pertahankan ritme belajarmu saat ini! Cobalah berjalan kaki singkat di luar ruangan untuk menjaga kesegaran pikiran.',
    },
};

describe('CreateCheckinUseCase', () => {
    it('creates a check-in when the user has not checked in today', async () => {
        const repository: CheckinRepository = {
            create: vi.fn().mockResolvedValue(createdCheckin),
            hasCheckinToday: vi.fn().mockResolvedValue(false),
        };

        const predictionService: PredictionService = {
            predict: vi.fn().mockResolvedValue({
                predicted_mood: 'normal',
                confidence: 0.85,
            }),
        };

        const useCase = new CreateCheckinUseCase(repository, predictionService);
        const result = await useCase.execute(15, validInput);

        expect(result).toEqual(createdCheckin);
        expect(repository.hasCheckinToday).toHaveBeenCalledWith(15);
        expect(predictionService.predict).toHaveBeenCalledWith({
            text: 'Felt good today',
            sleep_hours: 7.5,
            activity_level: 'MODERATE',
            how_you_feeling: 'NORMAL',
        });
        expect(repository.create).toHaveBeenCalledWith(15, validInput, {
            mood_result: 'NORMAL',
            confidence_score: 0.85,
            activity_suggestion: 'Pertahankan ritme belajarmu saat ini! Cobalah berjalan kaki singkat di luar ruangan untuk menjaga kesegaran pikiran.',
        });
    });

    it('throws when the user has already checked in today', async () => {
        const repository: CheckinRepository = {
            create: vi.fn(),
            hasCheckinToday: vi.fn().mockResolvedValue(true),
        };

        const predictionService: PredictionService = {
            predict: vi.fn(),
        };

        const useCase = new CreateCheckinUseCase(repository, predictionService);

        await expect(useCase.execute(15, validInput)).rejects.toThrow(
            'You have already checked in today',
        );
        expect(repository.hasCheckinToday).toHaveBeenCalledWith(15);
        expect(predictionService.predict).not.toHaveBeenCalled();
        expect(repository.create).not.toHaveBeenCalled();
    });
});
