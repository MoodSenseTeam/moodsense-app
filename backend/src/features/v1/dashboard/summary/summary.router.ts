import { Router } from 'express';
import type { SummaryController } from './summary.controller';

export function createSummaryRoutes(summaryController: SummaryController) {
    const router = Router();
    router.get('/summary', (req, res) => {
        return summaryController.getSummary(req, res);
    });

    router.get('/summary/insights', (req, res) => {
        return summaryController.getInsights(req, res);
    });

    return router;
}
