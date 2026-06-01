import type { Request, Response } from 'express';
import { createUserSchema } from './create-user.dto';
import type { CreateUserUseCase } from './create-user.usecase';

export class CreateUserController {
    constructor(private readonly createUserUseCase: CreateUserUseCase) {}

    async handle(req: Request, res: Response) {
        const input = createUserSchema.parse(req.body);
        const user = await this.createUserUseCase.execute(input);

        return res.status(201).json({
            message: 'User created successfully',
            data: user,
        });
    }
}
