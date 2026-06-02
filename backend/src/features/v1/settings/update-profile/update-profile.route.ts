import { Router } from 'express';
import type { UpdateProfileController } from './update-profile.controller';

export function createUpdateProfileRoutes(
    updateProfileController: UpdateProfileController,
) {
    const router = Router();

    router.patch('/profile', (req, res) => {
        return updateProfileController.handle(req, res);
    });

    return router;
}
