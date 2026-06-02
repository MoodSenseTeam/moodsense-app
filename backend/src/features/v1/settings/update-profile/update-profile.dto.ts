import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required').optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    tanggal_lahir: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Invalid date format',
        })
        .optional(),
    usage_reason: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
