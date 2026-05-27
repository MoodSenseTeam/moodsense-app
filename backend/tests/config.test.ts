import { describe, expect, it, afterEach } from 'vitest';

import { getConfig } from '../src/shared/config';

afterEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
    delete process.env.PORT;
    delete process.env.ALLOWED_ORIGINS;
    delete process.env.ACCESS_TOKEN_EXPIRES;
    delete process.env.REFRESH_TOKEN_EXPIRES;
});

describe('getConfig', () => {
    it('throws a helpful error when required config is missing', () => {
        expect(() => getConfig()).toThrow(
            'Missing required config: DATABASE_URL, JWT_SECRET',
        );
    });

    it('returns defaults for optional config values', () => {
        process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
        process.env.JWT_SECRET = 'secret';

        const config = getConfig();

        expect(config).toEqual({
            port: 5000,
            allowedOrigins: ['http://localhost:5173'],
            databaseUrl: 'postgresql://user:pass@localhost:5432/db',
            jwtSecret: 'secret',
            accessTokenExpires: '15m',
            refreshTokenExpires: '7d',
        });
    });
});