import type { Request, Response } from 'express';
import { updateSettingsSchema } from './update-settings.dto';
import type { UpdateSettingsUseCase } from './update-settings.usecase';

export class UpdateSettingsController {
    constructor(
        private readonly updateSettingsUseCase: UpdateSettingsUseCase,
    ) {}

    async handle(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const input = updateSettingsSchema.parse(req.body);
        const settings = await this.updateSettingsUseCase.execute(
            userId,
            input,
        );

        return res.status(200).json({
            message: 'Settings updated successfully',
            data: settings,
        });
    }
}
