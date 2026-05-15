import { z } from 'zod';

export const loginUserSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 chars'),
})

export type LoginUserDto = z.infer<typeof loginUserSchema>;