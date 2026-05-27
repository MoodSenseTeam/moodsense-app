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
        process.env.DATABASE_URL = '';
        process.env.JWT_SECRET = '';

        expect(() => getConfig()).toThrow(
            'Missing required config: DATABASE_URL, JWT_SECRET',
        );
    });

    it('parses custom optional config values', () => {
        process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
        process.env.JWT_SECRET = 'secret';
        process.env.PORT = '6001';
        process.env.ALLOWED_ORIGINS = 'http://localhost:3000, https://app.example.com ,';
        process.env.ACCESS_TOKEN_EXPIRES = '30m';
        process.env.REFRESH_TOKEN_EXPIRES = '14d';

        const config = getConfig();

        expect(config).toEqual({
            port: 6001,
            allowedOrigins: ['http://localhost:3000', 'https://app.example.com'],
            databaseUrl: 'postgresql://user:pass@localhost:5432/db',
            jwtSecret: 'secret',
            accessTokenExpires: '30m',
            refreshTokenExpires: '14d',
        });
    });

    it('throws when port is not numeric', () => {
        process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
        process.env.JWT_SECRET = 'secret';
        process.env.PORT = 'not-a-number';

        expect(() => getConfig()).toThrow(
            'Invalid config: PORT must be a number, received not-a-number',
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