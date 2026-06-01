import type { Request, Response } from 'express';
import { createCheckinSchema } from './checkin.dto';
import type { CreateCheckinUseCase } from './checkin.usecase';

export class CheckinController {
    constructor(private readonly createCheckinUseCase: CreateCheckinUseCase) {}

    async handle(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const input = createCheckinSchema.parse(req.body);
        const checkin = await this.createCheckinUseCase.execute(userId, input);

        return res.status(201).json({
            message: 'Check-in created successfully',
            data: checkin,
        });
    }
}
