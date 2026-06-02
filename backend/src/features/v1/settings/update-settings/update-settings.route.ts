import { Router } from 'express';
import type { UpdateSettingsController } from './update-settings.controller';

export function createUpdateSettingsRoutes(
    updateSettingsController: UpdateSettingsController,
) {
    const router = Router();

    router.patch('/', (req, res) => {
        return updateSettingsController.handle(req, res);
    });

    return router;
}
