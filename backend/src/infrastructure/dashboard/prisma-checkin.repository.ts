import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { CheckinRepository } from '@/shared/ports/checkin.repository';
import type {
    CreateCheckinDto,
    CreatedCheckinDto,
} from '@/features/v1/dashboard/checkin/checkin.dto';

export class PrismaCheckinRepository implements CheckinRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create(
        userId: number,
        data: CreateCheckinDto,
    ): Promise<CreatedCheckinDto> {
        const log = await this.prisma.mood_logs.create({
            data: {
                user_id: userId,
                sleep_hours: data.sleep_hours,
                activity_level: data.activity_level,
                study_hours: data.study_hours,
                social_score: data.social_score,
                notes: data.notes ?? null,
            },
            select: {
                log_id: true,
                user_id: true,
                sleep_hours: true,
                activity_level: true,
                study_hours: true,
                social_score: true,
                notes: true,
                logged_at: true,
                created_at: true,
            },
        });

        return {
            log_id: log.log_id,
            user_id: log.user_id,
            sleep_hours: log.sleep_hours,
            activity_level: log.activity_level,
            study_hours: log.study_hours,
            social_score: log.social_score,
            notes: log.notes,
            logged_at: log.logged_at.toISOString(),
            created_at: log.created_at.toISOString(),
        };
    }

    async hasCheckinToday(userId: number): Promise<boolean> {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setUTCHours(23, 59, 59, 999);

        const count = await this.prisma.mood_logs.count({
            where: {
                user_id: userId,
                logged_at: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        return count > 0;
    }
}
