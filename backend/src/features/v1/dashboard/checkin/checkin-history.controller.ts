import type { Request, Response } from 'express';
import type { GetCheckinHistoryUseCase } from './checkin-history.usecase';

export class CheckinHistoryController {
    constructor(private readonly getCheckinHistoryUseCase: GetCheckinHistoryUseCase) {}

    async handle(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const history = await this.getCheckinHistoryUseCase.execute(userId);
            return res.status(200).json({
                message: 'Check-in log history retrieved successfully',
                data: history,
            });
        } catch (error) {
            return res.status(500).json({
                message: (error as Error).message,
            });
        }
    }
}
