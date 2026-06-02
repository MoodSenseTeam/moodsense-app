import { z } from 'zod';

export const updateSettingsSchema = z.object({
    theme: z.enum(['light', 'dark']).optional(),
    reminder_active: z.boolean().optional(),
    reminder_time: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM')
        .optional(),
    language: z.enum(['id', 'en']).optional(),
});

export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;
