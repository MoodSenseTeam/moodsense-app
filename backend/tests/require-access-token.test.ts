import { describe, expect, it, vi } from 'vitest';

import { requireAccessToken } from '../src/shared/middleware/require-access-token';
import type { TokenService } from '../src/infrastructure/security/token-service';

function createResponseMock() {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });

    return { json, status };
}

describe('requireAccessToken', () => {
    it('attaches the decoded user to req and continues on valid token', async () => {
        const tokenService: TokenService = {
            issueAccessToken: async () => 'access-token',
            issueRefreshToken: async () => ({
                token: 'refresh-token',
                expiresAt: new Date('2026-05-27T00:00:00.000Z'),
            }),
            verifyRefreshToken: async () => null,
            verifyAccessToken: async (token: string) =>
                token === 'access-token'
                    ? { sub: 1, email: 'john@example.com' }
                    : null,
        };

        const middleware = requireAccessToken(tokenService);
        const next = vi.fn();
        const response = createResponseMock();
        const request = {
            header(name: string) {
                return name === 'authorization'
                    ? 'Bearer access-token'
                    : undefined;
            },
        } as never;

        await middleware(request, response as never, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(response.status).not.toHaveBeenCalled();
        expect((request as { user?: { user_id: number; email: string } }).user).toEqual({
            sub: 1,
            email: 'john@example.com',
            user_id: 1,
        });
    });

    it('rejects missing bearer tokens', async () => {
        const tokenService: TokenService = {
            issueAccessToken: async () => 'access-token',
            issueRefreshToken: async () => ({
                token: 'refresh-token',
                expiresAt: new Date('2026-05-27T00:00:00.000Z'),
            }),
            verifyRefreshToken: async () => null,
            verifyAccessToken: async () => null,
        };

        const middleware = requireAccessToken(tokenService);
        const next = vi.fn();
        const response = createResponseMock();

        await middleware(
            {
                header() {
                    return undefined;
                },
            } as never,
            response as never,
            next,
        );

        expect(next).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ message: 'Missing access token' });
    });

    it('rejects invalid bearer tokens', async () => {
        const tokenService: TokenService = {
            issueAccessToken: async () => 'access-token',
            issueRefreshToken: async () => ({
                token: 'refresh-token',
                expiresAt: new Date('2026-05-27T00:00:00.000Z'),
            }),
            verifyRefreshToken: async () => null,
            verifyAccessToken: async () => null,
        };

        const middleware = requireAccessToken(tokenService);
        const next = vi.fn();
        const response = createResponseMock();

        await middleware(
            {
                header(name: string) {
                    return name === 'authorization' ? 'Bearer bad-token' : undefined;
                },
            } as never,
            response as never,
            next,
        );

        expect(next).not.toHaveBeenCalled();
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ message: 'Invalid access token' });
    });
});
