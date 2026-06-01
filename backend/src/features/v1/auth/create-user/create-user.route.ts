import { Router } from 'express';
import type { CreateUserController } from './create-user.controller';

export function createUserRoutes(createUserController: CreateUserController) {
    const router = Router();

    router.post('/register', (req, res) => {
        return createUserController.handle(req, res);
    });

    return router;
}
