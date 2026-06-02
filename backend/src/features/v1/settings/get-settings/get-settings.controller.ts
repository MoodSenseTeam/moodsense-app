import type { Request, Response } from 'express';
import type { GetSettingsUseCase } from './get-settings.usecase';

export class GetSettingsController {
    constructor(private readonly getSettingsUseCase: GetSettingsUseCase) {}

    async handle(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const settings = await this.getSettingsUseCase.execute(userId);

        return res.status(200).json({
            message: 'Settings fetched successfully',
            data: settings,
        });
    }
}
