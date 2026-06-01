import type { NextFunction, Request, Response } from 'express';
import type { TokenService, JwtTokenPayload } from '@/infrastructure/security/token-service';

function extractBearerToken(authorizationHeader: string | undefined) {
    if (!authorizationHeader?.startsWith('Bearer ')) return null;
    return authorizationHeader.slice('Bearer '.length).trim();
}

export function requireAccessToken(tokenService: TokenService) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = extractBearerToken(req.header('authorization'));
        if (!token) {
            return res.status(401).json({ message: 'Missing access token' });
        }

        const payload = (await tokenService.verifyAccessToken(
            token,
        )) as JwtTokenPayload | null;

        if (!payload) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        const userId =
            typeof payload.sub === 'string' ? Number(payload.sub) : payload.sub;

        if (!userId || !payload.email || Number.isNaN(userId)) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        req.user = {
            sub: payload.sub,
            email: payload.email,
            user_id: userId,
        };

        return next();
    };
}
