import { Router } from 'express';
import type { ChangePasswordController } from './change-password.controller';

export function createChangePasswordRoutes(
    changePasswordController: ChangePasswordController,
) {
    const router = Router();

    router.post('/change-password', (req, res) => {
        return changePasswordController.handle(req, res);
    });

    return router;
}
