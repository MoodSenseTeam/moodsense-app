import { Router } from 'express';
import type { PredictionController } from './prediction.controller';

export function createPredictionRoutes(predictionController: PredictionController) {
    const router = Router();

    router.get('/prediction/forecast', (req, res) => {
        return predictionController.getForecast(req, res);
    });

    return router;
}
