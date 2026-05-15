import { Router } from 'express';
import type { MeController } from './me.controller';

export function createMeRoutes(meController: MeController) {
    const router = Router();

    router.get('/me', (req, res) => {
        return meController.handle(req, res);
    });

    return router;
}
