import { describe, expect, it, vi } from 'vitest';

import { CheckinController } from '../src/features/v1/dashboard/checkin/checkin.controller';
import type { CreatedCheckinDto } from '../src/features/v1/dashboard/checkin/checkin.dto';
import type { CreateCheckinUseCase } from '../src/features/v1/dashboard/checkin/checkin.usecase';

function createResponseMock() {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });

    return { json, status };
}

const validBody = {
    sleep_hours: 7.5,
    activity_level: 'MODERATE',
    study_hours: 4,
    social_score: 6,
    notes: 'Good day',
};

const createdCheckin: CreatedCheckinDto = {
    log_id: 1,
    user_id: 12,
    sleep_hours: 7.5,
    activity_level: 'MODERATE',
    study_hours: 4,
    social_score: 6,
    notes: 'Good day',
    logged_at: '2026-05-27T10:00:00.000Z',
    created_at: '2026-05-27T10:00:00.000Z',
};

describe('CheckinController', () => {
    it('returns 201 with created check-in data for authenticated users', async () => {
        const createCheckinUseCase = {
            execute: vi.fn().mockResolvedValue(createdCheckin),
        } as unknown as CreateCheckinUseCase;

        const controller = new CheckinController(createCheckinUseCase);
        const response = createResponseMock();

        await controller.handle(
            { user: { user_id: 12 }, body: validBody } as never,
            response as never,
        );

        expect(createCheckinUseCase.execute).toHaveBeenCalledWith(12, validBody);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({
            message: 'Check-in created successfully',
            data: createdCheckin,
        });
    });

    it('returns 401 when user is not authenticated', async () => {
        const createCheckinUseCase = {
            execute: vi.fn(),
        } as unknown as CreateCheckinUseCase;

        const controller = new CheckinController(createCheckinUseCase);
        const response = createResponseMock();

        await controller.handle(
            { body: validBody } as never,
            response as never,
        );

        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(createCheckinUseCase.execute).not.toHaveBeenCalled();
    });

    it('throws a Zod error when the request body is invalid', async () => {
        const createCheckinUseCase = {
            execute: vi.fn(),
        } as unknown as CreateCheckinUseCase;

        const controller = new CheckinController(createCheckinUseCase);
        const response = createResponseMock();

        await expect(
            controller.handle(
                { user: { user_id: 12 }, body: { sleep_hours: 'bad' } } as never,
                response as never,
            ),
        ).rejects.toThrow();

        expect(createCheckinUseCase.execute).not.toHaveBeenCalled();
    });
});
