import { Router } from 'express';
import type { LogoutController } from './logout.controller';

export function createLogoutRoutes(logoutController: LogoutController) {
    const router = Router();

    router.post('/logout', (req, res) => {
        return logoutController.handle(req, res);
    });

    return router;
}
