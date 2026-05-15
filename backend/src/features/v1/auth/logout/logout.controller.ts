import type { Request, Response } from 'express';
import { logoutSchema } from './logout.dto';
import type { LogoutUseCase } from './logout.usecase';

export class LogoutController {
    constructor(private readonly logoutUseCase: LogoutUseCase) { }

    async handle(req: Request, res: Response) {
        const input = logoutSchema.parse(req.body);
        const result = await this.logoutUseCase.execute(input);

        return res.status(200).json({
            message: result.message,
        });
    }
}
