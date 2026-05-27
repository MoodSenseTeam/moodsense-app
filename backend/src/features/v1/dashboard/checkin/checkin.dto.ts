import { z } from 'zod';

export const createCheckinSchema = z.object({
    sleep_hours: z.number().min(0, 'Sleep hours must be >= 0').max(24, 'Sleep hours must be <= 24'),
    activity_level: z.enum(['NONE', 'LOW', 'MODERATE', 'HIGH']),
    study_hours: z.number().min(0, 'Study hours must be >= 0').max(24, 'Study hours must be <= 24'),
    social_score: z.number().int('Social score must be an integer').min(1, 'Social score must be >= 1').max(10, 'Social score must be <= 10'),
    notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
});

export type CreateCheckinDto = z.infer<typeof createCheckinSchema>;

export interface CreatedCheckinDto {
    log_id: number;
    user_id: number;
    sleep_hours: number;
    activity_level: string;
    study_hours: number;
    social_score: number;
    notes: string | null;
    logged_at: string;
    created_at: string;
}
