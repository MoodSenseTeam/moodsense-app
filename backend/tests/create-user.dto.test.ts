import { describe, expect, it } from 'vitest';

import { createUserSchema } from '../src/features/v1/auth/create-user/create-user.dto';

describe('createUserSchema', () => {
    it('accepts valid registration data', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'supersecret',
            gender: 'MALE',
            tanggal_lahir: '2000-01-01',
        });

        expect(result.success).toBe(true);
    });

    it('accepts optional usage_reason', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'supersecret',
            gender: 'FEMALE',
            tanggal_lahir: '2000-01-01',
            usage_reason: 'mental health tracking',
        });

        expect(result.success).toBe(true);
    });

    it('rejects invalid emails', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'not-an-email',
            password: 'supersecret',
            gender: 'MALE',
            tanggal_lahir: '2000-01-01',
        });

        expect(result.success).toBe(false);
    });

    it('rejects short passwords', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'short',
            gender: 'MALE',
            tanggal_lahir: '2000-01-01',
        });

        expect(result.success).toBe(false);
    });

    it('rejects invalid gender', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'supersecret',
            gender: 'UNKNOWN',
            tanggal_lahir: '2000-01-01',
        });

        expect(result.success).toBe(false);
    });

    it('rejects invalid date format', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'supersecret',
            gender: 'MALE',
            tanggal_lahir: 'not-a-date',
        });

        expect(result.success).toBe(false);
    });
});
