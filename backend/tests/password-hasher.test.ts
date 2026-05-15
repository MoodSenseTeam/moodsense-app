import { describe, expect, it } from 'vitest';

import { ScryptPasswordHasher } from '../src/infrastructure/security/password-hasher';

describe('ScryptPasswordHasher', () => {
    it('hashes passwords and verifies matches', async () => {
        const hasher = new ScryptPasswordHasher();

        const hashedPassword = await hasher.hash('supersecret');

        expect(hashedPassword).toContain(':');
        await expect(hasher.compare('supersecret', hashedPassword)).resolves.toBe(true);
        await expect(hasher.compare('wrong-password', hashedPassword)).resolves.toBe(false);
    });
});