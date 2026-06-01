import { describe, expect, it, vi } from 'vitest';
import { CreateCheckinUseCase } from '../src/features/v1/dashboard/checkin/checkin.usecase';
import { HttpPredictionService } from '../src/infrastructure/prediction/http-prediction.service';
import type { CheckinRepository } from '../src/shared/ports/checkin.repository';

const validInput = {
    sleep_hours: 6.5,
    activity_level: 'MODERATE' as const,
    study_hours: 5,
    social_score: 7,
    how_you_feeling: 'STRESS' as const,
    notes: 'aku sangat sedih dan muak dengan semua ini', // Live Indonesian stress phrase
};

describe('Check-in E2E Integration with ML API', () => {
    it('successfully queries live ML API and generates correct Indonesian activity suggestions', async () => {
        // Set ML API URL for testing
        process.env.ML_API_URL = 'http://127.0.0.1:8000';

        const predictionService = new HttpPredictionService();
        
        // Mock checkin repository
        const createMock = vi.fn().mockImplementation((userId, input, prediction) => {
            return {
                log_id: 999,
                user_id: userId,
                ...input,
                logged_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                prediction,
            };
        });

        const repository: CheckinRepository = {
            create: createMock,
            hasCheckinToday: vi.fn().mockResolvedValue(false),
        };

        const useCase = new CreateCheckinUseCase(repository, predictionService);
        const result = await useCase.execute(42, validInput);

        // Assert E2E flow outcomes
        expect(result.log_id).toBe(999);
        expect(result.user_id).toBe(42);
        
        // Verify prediction block returned by ML API
        expect(result.prediction).toBeDefined();
        expect(result.prediction?.mood_result).toBe('STRESS');
        expect(result.prediction?.confidence_score).toBeGreaterThan(0.8);
        
        // Verify Indonesian activity suggestion for stress
        expect(result.prediction?.activity_suggestion).toContain('Ambil jeda istirahat 15 menit');
        
        expect(repository.hasCheckinToday).toHaveBeenCalledWith(42);
        expect(repository.create).toHaveBeenCalled();
    });
});
