import dotenv from 'dotenv';

dotenv.config();

type AppConfig = {
    port: number;
    allowedOrigins: string[];
    databaseUrl: string;
    jwtSecret: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
};

const DEFAULT_PORT = 5000;
const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173'];
const DEFAULT_ACCESS_TOKEN_EXPIRES = '15m';
const DEFAULT_REFRESH_TOKEN_EXPIRES = '7d';

function readRequiredEnv(name: string) {
    const value = process.env[name];
    return value && value.trim().length > 0 ? value : null;
}

function readOptionalEnv(name: string, fallback: string) {
    const value = process.env[name];
    return value && value.trim().length > 0 ? value : fallback;
}

export function getConfig(): AppConfig {
    const missing: string[] = [];

    const databaseUrl = readRequiredEnv('DATABASE_URL');
    if (!databaseUrl) missing.push('DATABASE_URL');

    const jwtSecret = readRequiredEnv('JWT_SECRET');
    if (!jwtSecret) missing.push('JWT_SECRET');

    if (missing.length > 0) {
        throw new Error(`Missing required config: ${missing.join(', ')}`);
    }

    const portValue = readOptionalEnv('PORT', String(DEFAULT_PORT));
    const port = Number(portValue);

    if (Number.isNaN(port)) {
        throw new Error(
            `Invalid config: PORT must be a number, received ${portValue}`,
        );
    }

    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
              .map((origin) => origin.trim())
              .filter(Boolean)
        : DEFAULT_ALLOWED_ORIGINS;

    return {
        port,
        allowedOrigins,
        databaseUrl: databaseUrl!,
        jwtSecret: jwtSecret!,
        accessTokenExpires: readOptionalEnv(
            'ACCESS_TOKEN_EXPIRES',
            DEFAULT_ACCESS_TOKEN_EXPIRES,
        ),
        refreshTokenExpires: readOptionalEnv(
            'REFRESH_TOKEN_EXPIRES',
            DEFAULT_REFRESH_TOKEN_EXPIRES,
        ),
    };
}