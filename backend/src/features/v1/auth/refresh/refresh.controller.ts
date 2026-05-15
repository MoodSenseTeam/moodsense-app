import type { Request, Response } from 'express';
import { refreshTokenSchema } from './refresh.dto';
import type { RefreshUseCase } from './refresh.usecase';

export class RefreshController {
    constructor(private readonly refreshUseCase: RefreshUseCase) { }

    async handle(req: Request, res: Response) {
        const input = refreshTokenSchema.parse(req.body);
        const result = await this.refreshUseCase.execute(input);

        return res.status(200).json({
            message: 'Token refreshed successfully',
            data: result,
        });
    }
}
