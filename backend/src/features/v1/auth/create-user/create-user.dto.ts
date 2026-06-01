import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 chars'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    tanggal_lahir: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    usage_reason: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
