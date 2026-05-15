import type { Request, Response } from 'express';
import type { TokenService } from '../login/login.usecase';
import type { UserRepository } from '@/shared/ports/user.repository';

type AccessPayload = {
    sub?: string | number;
    email?: string;
};

function extractBearerToken(authorizationHeader: string | undefined) {
    if (!authorizationHeader?.startsWith('Bearer ')) return null;
    return authorizationHeader.slice('Bearer '.length).trim();
}

export class MeController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) { }

    async handle(req: Request, res: Response) {
        const token = extractBearerToken(req.header('authorization'));
        if (!token) {
            return res.status(401).json({ message: 'Missing access token' });
        }

        const payload = (await this.tokenService.verifyAccessToken?.(token)) as AccessPayload | null;
        if (!payload?.sub || !payload.email) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        const user = await this.userRepository.findByEmailWithPassword(payload.email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Current user fetched successfully',
            data: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
            },
        });
    }
}
