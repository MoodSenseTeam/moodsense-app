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
        prediction: {
            mood_result: 'STRESS' | 'HAPPY' | 'NORMAL';
            confidence_score: number;
            activity_suggestion: string;
        }
    ): Promise<CreatedCheckinDto> {
        return this.prisma.$transaction(async (tx) => {
            const log = await tx.mood_logs.create({
                data: {
                    user_id: userId,
                    sleep_hours: data.sleep_hours,
                    activity_level: data.activity_level,
                    study_hours: data.study_hours,
                    social_score: data.social_score,
                    how_you_feeling: data.how_you_feeling,
                    notes: data.notes ?? null,
                },
                select: {
                    log_id: true,
                    user_id: true,
                    sleep_hours: true,
                    activity_level: true,
                    study_hours: true,
                    social_score: true,
                    how_you_feeling: true,
                    notes: true,
                    logged_at: true,
                    created_at: true,
                },
            });

            const pred = await tx.mood_predictions.create({
                data: {
                    log_id: log.log_id,
                    mood_result: prediction.mood_result,
                    confidence_score: prediction.confidence_score,
                    activity_suggestion: prediction.activity_suggestion,
                },
            });

            return {
                log_id: log.log_id,
                user_id: log.user_id,
                sleep_hours: log.sleep_hours,
                activity_level: log.activity_level,
                study_hours: log.study_hours,
                social_score: log.social_score,
                how_you_feeling: log.how_you_feeling,
                notes: log.notes,
                logged_at: log.logged_at.toISOString(),
                created_at: log.created_at.toISOString(),
                prediction: {
                    mood_result: pred.mood_result,
                    confidence_score: pred.confidence_score,
                    activity_suggestion: pred.activity_suggestion,
                },
            };
        });
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

    async getHistory(userId: number): Promise<CreatedCheckinDto[]> {
        const logs = await this.prisma.mood_logs.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                logged_at: 'desc',
            },
            include: {
                prediction: true,
            },
        });

        return logs.map((log) => ({
            log_id: log.log_id,
            user_id: log.user_id,
            sleep_hours: log.sleep_hours,
            activity_level: log.activity_level,
            study_hours: log.study_hours,
            social_score: log.social_score,
            how_you_feeling: log.how_you_feeling,
            notes: log.notes,
            logged_at: log.logged_at.toISOString(),
            created_at: log.created_at.toISOString(),
            prediction: log.prediction
                ? {
                      mood_result: log.prediction.mood_result,
                      confidence_score: log.prediction.confidence_score,
                      activity_suggestion: log.prediction.activity_suggestion,
                  }
                : undefined,
        }));
    }
}
