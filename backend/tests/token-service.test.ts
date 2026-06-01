import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { JwtTokenService } from '../src/infrastructure/security/token-service';

describe('JwtTokenService', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
        process.env.ACCESS_TOKEN_EXPIRES = '1h';
        process.env.REFRESH_TOKEN_EXPIRES = '2h';
    });

    afterEach(() => {
        delete process.env.JWT_SECRET;
        delete process.env.ACCESS_TOKEN_EXPIRES;
        delete process.env.REFRESH_TOKEN_EXPIRES;
    });

    it('issues and verifies tokens', async () => {
        const svc = new JwtTokenService();

        const access = await svc.issueAccessToken({
            sub: 1,
            email: 'dev@example.com',
        });
        const { token: refresh, expiresAt } = await svc.issueRefreshToken({
            sub: 1,
        });

        expect(typeof access).toBe('string');
        expect(typeof refresh).toBe('string');
        expect(expiresAt instanceof Date).toBe(true);

        const verified = await svc.verifyRefreshToken(refresh);
        expect(verified).not.toBeNull();
        expect((verified as any).sub).toBe(1);
    });

    it('returns null for invalid token', async () => {
        const svc = new JwtTokenService();
        const res = await svc.verifyRefreshToken('not-a-token');
        expect(res).toBeNull();
    });
});
