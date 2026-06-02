import type { Request, Response } from 'express';
import { changePasswordSchema } from './change-password.dto';
import type { ChangePasswordUseCase } from './change-password.usecase';

export class ChangePasswordController {
    constructor(
        private readonly changePasswordUseCase: ChangePasswordUseCase,
    ) {}

    async handle(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const input = changePasswordSchema.parse(req.body);

        try {
            await this.changePasswordUseCase.execute(userId, input);
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Current password is incorrect'
            ) {
                return res.status(400).json({ message: error.message });
            }
            throw error;
        }

        return res.status(200).json({
            message: 'Password changed successfully',
        });
    }
}
