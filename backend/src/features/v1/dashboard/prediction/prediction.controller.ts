import type { Request, Response } from 'express';
import { GetPredictionUseCase } from './prediction.usecase';

export class PredictionController {
    constructor(private readonly getPredictionUseCase: GetPredictionUseCase) {}

    async getForecast(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const forecast = await this.getPredictionUseCase.execute(userId);
            return res.status(200).json({ data: forecast });
        } catch (error) {
            // If user has no check-in data yet, return null gracefully
            if (error instanceof Error && error.message.includes('weekly_mood_trend')) {
                return res.status(200).json({ data: null });
            }
            throw error;
        }
    }
}
