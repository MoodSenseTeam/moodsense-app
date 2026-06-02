import type { Request, Response } from 'express';
import { updateProfileSchema } from './update-profile.dto';
import type { UpdateProfileUseCase } from './update-profile.usecase';

export class UpdateProfileController {
    constructor(
        private readonly updateProfileUseCase: UpdateProfileUseCase,
    ) {}

    async handle(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const input = updateProfileSchema.parse(req.body);
        const user = await this.updateProfileUseCase.execute(userId, input);

        return res.status(200).json({
            message: 'Profile updated successfully',
            data: user,
        });
    }
}
