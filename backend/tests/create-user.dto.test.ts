import { describe, expect, it } from 'vitest';

import { createUserSchema } from '../src/features/v1/auth/create-user/create-user.dto';

describe('createUserSchema', () => {
    it('accepts valid registration data', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'supersecret',
        });

        expect(result.success).toBe(true);
    });

    it('rejects invalid emails', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'not-an-email',
            password: 'supersecret',
        });

        expect(result.success).toBe(false);
    });

    it('rejects short passwords', () => {
        const result = createUserSchema.safeParse({
            name: 'Stezi',
            email: 'stezi@example.com',
            password: 'short',
        });

        expect(result.success).toBe(false);
    });
});