import { Router } from 'express';
import type { CheckinController } from './checkin.controller';

export function createCheckinRoutes(checkinController: CheckinController) {
    const router = Router();

    router.post('/checkin', (req, res) => {
        return checkinController.handle(req, res);
    });

    return router;
}
