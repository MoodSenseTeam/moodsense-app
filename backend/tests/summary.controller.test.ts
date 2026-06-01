import { describe, expect, it, vi } from 'vitest';

import { SummaryController } from '../src/features/v1/dashboard/summary/summary.controller';
import type {
    SummaryDto,
    SummaryInsightsDto,
} from '../src/features/v1/dashboard/summary/summary.dto';
import type { GetSummaryUseCase } from '../src/features/v1/dashboard/summary/summary.usecase';

function createResponseMock() {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });

    return { json, status };
}

describe('SummaryController', () => {
    it('returns summary data for authenticated users', async () => {
        const summary: SummaryDto = {
            overview: {
                check_in_streak: 3,
                average_mood: 6.2,
                sleep_quality: 7.1,
            },
            recent_mood_entries: [],
            weekly_mood_trend: [],
        };

        const getSummaryUseCase = {
            execute: vi.fn().mockResolvedValue(summary),
            getInsights: vi.fn(),
        } as unknown as GetSummaryUseCase;

        const controller = new SummaryController(getSummaryUseCase);
        const response = createResponseMock();

        await controller.getSummary(
            { user: { user_id: 12 } } as never,
            response as never,
        );

        expect(getSummaryUseCase.execute).toHaveBeenCalledWith(12);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(summary);
    });

    it('returns insights data for authenticated users', async () => {
        const insights: SummaryInsightsDto = {
            mood_prediction: {
                predicted_mood: 6,
                confidence_score: 0.88,
            },
            recommendations: ['Drink water', 'Take a short walk'],
        };

        const getSummaryUseCase = {
            execute: vi.fn(),
            getInsights: vi.fn().mockResolvedValue(insights),
        } as unknown as GetSummaryUseCase;

        const controller = new SummaryController(getSummaryUseCase);
        const response = createResponseMock();

        await controller.getInsights(
            { user: { user_id: 12 } } as never,
            response as never,
        );

        expect(getSummaryUseCase.getInsights).toHaveBeenCalledWith(12);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith(insights);
    });

    it('rejects requests without an authenticated user', async () => {
        const getSummaryUseCase = {
            execute: vi.fn(),
            getInsights: vi.fn(),
        } as unknown as GetSummaryUseCase;

        const controller = new SummaryController(getSummaryUseCase);
        const response = createResponseMock();

        await controller.getSummary({} as never, response as never);

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(getSummaryUseCase.execute).not.toHaveBeenCalled();
    });
});
