import { Router } from 'express';
import type { RefreshController } from './refresh.controller';

export function createRefreshRoutes(refreshController: RefreshController) {
    const router = Router();

    router.post('/refresh', (req, res) => {
        return refreshController.handle(req, res);
    });

    return router;
}
