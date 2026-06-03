import { describe, expect, it, vi } from 'vitest';

import { GetSummaryUseCase } from '../src/features/v1/dashboard/summary/summary.usecase';
import { SyncTodosUseCase } from '../src/features/v1/dashboard/todos/todo.usecase';
import type {
    SummaryDto,
    SummaryInsightsDto,
} from '../src/features/v1/dashboard/summary/summary.dto';
import type { SummaryRepository } from '../src/shared/ports/summary.repository';
import type { TodoRepository } from '../src/shared/ports/todo.repository';

function createMockSyncTodosUseCase(): SyncTodosUseCase {
    const mockRepo: TodoRepository = {
        listByUser: vi.fn(),
        upsert: vi.fn(),
        toggle: vi.fn(),
    };
    return new SyncTodosUseCase(mockRepo);
}

describe('GetSummaryUseCase', () => {
    it('delegates the core summary request to the repository', async () => {
        const summary: SummaryDto = {
            overview: {
                check_in_streak: 4,
                average_mood: 7.5,
                sleep_quality: 8.25,
            },
            recent_mood_entries: [],
            weekly_mood_trend: [],
        };

        const repository: SummaryRepository = {
            getSummaryForUser: vi.fn().mockResolvedValue(summary),
            getInsightsForUser: vi.fn(),
        };

        const useCase = new GetSummaryUseCase(repository, createMockSyncTodosUseCase());

        await expect(useCase.execute(15)).resolves.toEqual(summary);
        expect(repository.getSummaryForUser).toHaveBeenCalledWith(15);
    });

    it('delegates the insights request to the repository', async () => {
        const insights: SummaryInsightsDto = {
            mood_prediction: {
                predicted_mood: 6,
                confidence_score: 0.91,
            },
            ai_insight: 'Keep studying',
            recommendations: [
                { name: 'Pomodoro', description: 'Study with Pomodoro', duration: '25 minutes' },
            ],
            factors: {
                stressors: [],
                boosters: [
                    { name: 'Belajar', value: '4 jam', description: 'Belajar produktif' },
                ],
            },
        };

        const repository: SummaryRepository = {
            getSummaryForUser: vi.fn(),
            getInsightsForUser: vi.fn().mockResolvedValue(insights),
        };

        const useCase = new GetSummaryUseCase(repository, createMockSyncTodosUseCase());

        await expect(useCase.getInsights(15)).resolves.toEqual(insights);
        expect(repository.getInsightsForUser).toHaveBeenCalledWith(15);
    });
});
