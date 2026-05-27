import { describe, expect, it, vi } from 'vitest';

import { CreateCheckinUseCase } from '../src/features/v1/dashboard/checkin/checkin.usecase';
import type { CreatedCheckinDto } from '../src/features/v1/dashboard/checkin/checkin.dto';
import type { CheckinRepository } from '../src/shared/ports/checkin.repository';

const validInput = {
    sleep_hours: 7.5,
    activity_level: 'MODERATE' as const,
    study_hours: 4,
    social_score: 6,
    notes: 'Felt good today',
};

const createdCheckin: CreatedCheckinDto = {
    log_id: 1,
    user_id: 15,
    sleep_hours: 7.5,
    activity_level: 'MODERATE',
    study_hours: 4,
    social_score: 6,
    notes: 'Felt good today',
    logged_at: '2026-05-27T10:00:00.000Z',
    created_at: '2026-05-27T10:00:00.000Z',
};

describe('CreateCheckinUseCase', () => {
    it('creates a check-in when the user has not checked in today', async () => {
        const repository: CheckinRepository = {
            create: vi.fn().mockResolvedValue(createdCheckin),
            hasCheckinToday: vi.fn().mockResolvedValue(false),
        };

        const useCase = new CreateCheckinUseCase(repository);
        const result = await useCase.execute(15, validInput);

        expect(result).toEqual(createdCheckin);
        expect(repository.hasCheckinToday).toHaveBeenCalledWith(15);
        expect(repository.create).toHaveBeenCalledWith(15, validInput);
    });

    it('throws when the user has already checked in today', async () => {
        const repository: CheckinRepository = {
            create: vi.fn(),
            hasCheckinToday: vi.fn().mockResolvedValue(true),
        };

        const useCase = new CreateCheckinUseCase(repository);

        await expect(useCase.execute(15, validInput)).rejects.toThrow(
            'You have already checked in today',
        );
        expect(repository.hasCheckinToday).toHaveBeenCalledWith(15);
        expect(repository.create).not.toHaveBeenCalled();
    });
});
