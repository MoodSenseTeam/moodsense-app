import { describe, expect, it, vi } from 'vitest';

import { Email } from '../../src/domain/user/email.vo';
import { PasswordHash } from '../../src/domain/user/password.vo';
import { User } from '../../src/domain/user/user';

describe('User domain', () => {
    it('creates from primitives and exports primitives', () => {
        const p = {
            user_id: 42,
            name: 'Alice',
            email: 'alice@example.com',
            password: 'hashed:secret',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const user = User.fromPrimitives(p);

        const out = user.toPrimitives();

        expect(out.user_id).toBe(42);
        expect(out.email).toBe('alice@example.com');
        expect(out.name).toBe('Alice');
        expect(out.password).toBe('hashed:secret');
        expect(out.created_at).toBe(p.created_at);
        expect(out.updated_at).toBe(p.updated_at);
    });

    it('validates email and name on create', () => {
        const email = Email.create('bob@example.com');
        const hash = PasswordHash.fromHash('h');

        const user = User.create({ name: 'Bob', email, passwordHash: hash });

        expect(user.name).toBe('Bob');
        expect(user.toPrimitives().email).toBe('bob@example.com');
    });

    it('rejects invalid email', () => {
        expect(() => Email.create('not-an-email')).toThrow();
    });

    it('changes name and updates timestamp', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-15T12:00:00.000Z'));

        try {
            const email = Email.create('c@example.com');
            const hash = PasswordHash.fromHash('h');

            const user = User.create({ name: 'C', email, passwordHash: hash });

            const before = user.toPrimitives().updated_at;
            user.changeName('C Updated');
            const after = user.toPrimitives().updated_at;

            expect(user.name).toBe('C Updated');
            expect(after).not.toBe(before);
        } finally {
            vi.useRealTimers();
        }
    });
});
