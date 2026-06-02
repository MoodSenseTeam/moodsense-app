import { Router } from 'express';
import type { GetSettingsController } from './get-settings.controller';

export function createGetSettingsRoutes(
    getSettingsController: GetSettingsController,
) {
    const router = Router();

    router.get('/', (req, res) => {
        return getSettingsController.handle(req, res);
    });

    return router;
}
