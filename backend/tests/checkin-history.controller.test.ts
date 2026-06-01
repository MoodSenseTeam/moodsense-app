import { describe, expect, it, vi } from 'vitest';
import { CheckinHistoryController } from '../src/features/v1/dashboard/checkin/checkin-history.controller';
import type { GetCheckinHistoryUseCase } from '../src/features/v1/dashboard/checkin/checkin-history.usecase';
import type { CreatedCheckinDto } from '../src/features/v1/dashboard/checkin/checkin.dto';

function createResponseMock() {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    return { json, status };
}

const mockHistory: CreatedCheckinDto[] = [
    {
        log_id: 1,
        user_id: 12,
        sleep_hours: 7.5,
        activity_level: 'MODERATE',
        study_hours: 4,
        social_score: 6,
        how_you_feeling: 'NORMAL',
        notes: 'Good day',
        logged_at: '2026-05-27T10:00:00.000Z',
        created_at: '2026-05-27T10:00:00.000Z',
    },
];

describe('CheckinHistoryController', () => {
    it('returns 200 with check-in history data for authenticated users', async () => {
        const getCheckinHistoryUseCase = {
            execute: vi.fn().mockResolvedValue(mockHistory),
        } as unknown as GetCheckinHistoryUseCase;

        const controller = new CheckinHistoryController(getCheckinHistoryUseCase);
        const response = createResponseMock();

        await controller.handle(
            { user: { user_id: 12 } } as never,
            response as never,
        );

        expect(getCheckinHistoryUseCase.execute).toHaveBeenCalledWith(12);
        expect(response.status).toHaveBeenCalledWith(200);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Check-in log history retrieved successfully',
            data: mockHistory,
        });
    });

    it('returns 401 when user is not authenticated', async () => {
        const getCheckinHistoryUseCase = {
            execute: vi.fn(),
        } as unknown as GetCheckinHistoryUseCase;

        const controller = new CheckinHistoryController(getCheckinHistoryUseCase);
        const response = createResponseMock();

        await controller.handle(
            {} as never,
            response as never,
        );

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(getCheckinHistoryUseCase.execute).not.toHaveBeenCalled();
    });
});
