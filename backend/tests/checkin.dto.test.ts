import { describe, expect, it } from 'vitest';

import { createCheckinSchema } from '../src/features/v1/dashboard/checkin/checkin.dto';

const validCheckin = {
    sleep_hours: 7.5,
    activity_level: 'MODERATE',
    study_hours: 4,
    social_score: 6,
    how_you_feeling: 'NORMAL',
};

describe('createCheckinSchema', () => {
    it('accepts valid check-in data', () => {
        const result = createCheckinSchema.safeParse(validCheckin);
        expect(result.success).toBe(true);
    });

    it('accepts check-in with optional notes', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            notes: 'Felt great after a morning run',
        });
        expect(result.success).toBe(true);
    });

    it('accepts boundary values for sleep_hours (0 and 24)', () => {
        expect(
            createCheckinSchema.safeParse({ ...validCheckin, sleep_hours: 0 })
                .success,
        ).toBe(true);
        expect(
            createCheckinSchema.safeParse({ ...validCheckin, sleep_hours: 24 })
                .success,
        ).toBe(true);
    });

    it('accepts boundary values for social_score (1 and 10)', () => {
        expect(
            createCheckinSchema.safeParse({ ...validCheckin, social_score: 1 })
                .success,
        ).toBe(true);
        expect(
            createCheckinSchema.safeParse({ ...validCheckin, social_score: 10 })
                .success,
        ).toBe(true);
    });

    it('accepts all valid activity levels', () => {
        for (const level of ['NONE', 'LOW', 'MODERATE', 'HIGH']) {
            expect(
                createCheckinSchema.safeParse({
                    ...validCheckin,
                    activity_level: level,
                }).success,
            ).toBe(true);
        }
    });

    it('rejects negative sleep_hours', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            sleep_hours: -1,
        });
        expect(result.success).toBe(false);
    });

    it('rejects sleep_hours above 24', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            sleep_hours: 25,
        });
        expect(result.success).toBe(false);
    });

    it('rejects invalid activity_level', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            activity_level: 'EXTREME',
        });
        expect(result.success).toBe(false);
    });

    it('rejects social_score below 1', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            social_score: 0,
        });
        expect(result.success).toBe(false);
    });

    it('rejects social_score above 10', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            social_score: 11,
        });
        expect(result.success).toBe(false);
    });

    it('rejects non-integer social_score', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            social_score: 5.5,
        });
        expect(result.success).toBe(false);
    });

    it('rejects notes exceeding 500 characters', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            notes: 'x'.repeat(501),
        });
        expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
        const result = createCheckinSchema.safeParse({
            sleep_hours: 7,
        });
        expect(result.success).toBe(false);
    });

    it('rejects non-numeric sleep_hours', () => {
        const result = createCheckinSchema.safeParse({
            ...validCheckin,
            sleep_hours: 'seven',
        });
        expect(result.success).toBe(false);
    });
});
