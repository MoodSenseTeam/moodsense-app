import type { JwtTokenPayload } from '@/infrastructure/security/token-service';

declare global {
    namespace Express {
        interface Request {
            user?: JwtTokenPayload & { user_id?: number };
        }
    }
}

export {};