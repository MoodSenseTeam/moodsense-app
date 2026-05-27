import type { Request, Response } from 'express';
import { GetSummaryUseCase } from './summary.usecase';
import type { SummaryInsightsDto, SummaryDto } from './summary.dto';

export class SummaryController {
    constructor(private readonly getSummaryUseCase: GetSummaryUseCase) {}

    async getSummary(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const summary: SummaryDto =
            await this.getSummaryUseCase.execute(userId);
        return res.status(200).json(summary);
    }

    async getInsights(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const insights: SummaryInsightsDto =
            await this.getSummaryUseCase.getInsights(userId);
        return res.status(200).json(insights);
    }
}
