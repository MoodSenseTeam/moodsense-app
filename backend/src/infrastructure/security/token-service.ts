import jwt, { type Secret, type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { parseDurationToMs } from '@/shared/utils/parse-duration';

export type JwtTokenPayload = {
    sub?: string | number;
    email?: string;
};

export interface TokenService {
    issueAccessToken(payload: object): Promise<string>;
    issueRefreshToken(payload: object): Promise<{ token: string; expiresAt: Date }>;
    verifyRefreshToken(token: string): Promise<object | null>;
    verifyAccessToken(token: string): Promise<object | null>;
}

export class JwtTokenService implements TokenService {
    private readonly secret: Secret;
    private readonly accessExpires: string;
    private readonly refreshExpires: string;

    constructor() {
        this.secret = (process.env.JWT_SECRET || 'change-me') as Secret;
        this.accessExpires = process.env.ACCESS_TOKEN_EXPIRES || '15m';
        this.refreshExpires = process.env.REFRESH_TOKEN_EXPIRES || '7d';
    }

    async issueAccessToken(payload: object): Promise<string> {
        return jwt.sign(payload as JwtPayload, this.secret, { expiresIn: this.accessExpires } as SignOptions);
    }

    async issueRefreshToken(payload: object): Promise<{ token: string; expiresAt: Date }> {
        const token = jwt.sign(payload as JwtPayload, this.secret, { expiresIn: this.refreshExpires } as SignOptions);

        const ms = parseDurationToMs(this.refreshExpires);
        const expiresAt = new Date(Date.now() + ms);

        return { token, expiresAt };
    }

    async verifyRefreshToken(token: string): Promise<object | null> {
        return this.verify(token);
    }

    async verifyAccessToken(token: string): Promise<object | null> {
        return this.verify(token);
    }

    private async verify(token: string): Promise<object | null> {
        try {
            return jwt.verify(token, this.secret) as object;
        } catch {
            return null;
        }
    }
}
