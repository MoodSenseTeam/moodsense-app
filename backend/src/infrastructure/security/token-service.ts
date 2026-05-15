import jwt, { type Secret, type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { parseDurationToMs } from '../../shared/utils/parse-duration';

export class JwtTokenService {
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

    /**
     * Issue a refresh token and return both the token and its expiry date.
     */
    async issueRefreshToken(payload: object): Promise<{ token: string; expiresAt: Date }> {
        const token = jwt.sign(payload as JwtPayload, this.secret, { expiresIn: this.refreshExpires } as SignOptions);

        // Compute numeric expiry for persistence using the same env value.
        const ms = parseDurationToMs(this.refreshExpires) || 7 * 24 * 60 * 60 * 1000;
        const expiresAt = new Date(Date.now() + ms);

        return { token, expiresAt };
    }

    async verifyRefreshToken(token: string): Promise<object | null> {
        try {
            return jwt.verify(token, this.secret) as object;
        } catch {
            return null;
        }
    }

    async verifyAccessToken(token: string): Promise<object | null> {
        try {
            return jwt.verify(token, this.secret) as object;
        } catch {
            return null;
        }
    }
}
