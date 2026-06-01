import type { Request, Response } from 'express';
import { loginUserSchema } from './login.dto';
import type { LoginUseCase } from './login.usecase';

export class LoginController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    async handle(req: Request, res: Response) {
        const input = loginUserSchema.parse(req.body);
        const result = await this.loginUseCase.execute(input);

        return res.status(200).json({
            message: 'Login successful',
            data: result,
        });
    }
}
