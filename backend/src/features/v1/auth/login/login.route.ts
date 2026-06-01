import { Router } from 'express';
import type { LoginController } from './login.controller';

export function createLoginRoutes(loginController: LoginController) {
    const router = Router();

    router.post('/login', (req, res) => {
        return loginController.handle(req, res);
    });

    return router;
}
