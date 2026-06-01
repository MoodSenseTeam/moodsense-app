import { Router } from 'express';
import type { CheckinController } from './checkin.controller';
import type { CheckinHistoryController } from './checkin-history.controller';

export function createCheckinRoutes(
    checkinController: CheckinController,
    checkinHistoryController: CheckinHistoryController,
) {
    const router = Router();

    router.post('/checkin', (req, res) => {
        return checkinController.handle(req, res);
    });

    router.get('/checkin/history', (req, res) => {
        return checkinHistoryController.handle(req, res);
    });

    return router;
}
