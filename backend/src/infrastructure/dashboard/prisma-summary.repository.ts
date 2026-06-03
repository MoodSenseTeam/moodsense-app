import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { SummaryRepository } from '@/shared/ports/summary.repository';
import type {
    SummaryDto,
    SummaryInsightsDto,
} from '@/features/v1/dashboard/summary/summary.dto';

export class PrismaSummaryRepository implements SummaryRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async getSummaryForUser(userId: number): Promise<SummaryDto> {
        const logs = await this.prisma.mood_logs.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            select: {
                created_at: true,
                logged_at: true,
                sleep_hours: true,
                sentiment_score: true,
                notes: true,
                prediction: {
                    select: {
                        mood_result: true,
                    },
                },
            },
        });

        const moodScores = logs.map((log) =>
            this.toMoodScore(
                log.prediction?.mood_result ?? null,
                log.sentiment_score,
            ),
        );
        const sleepHours = logs.map((log) => log.sleep_hours);

        return {
            overview: {
                check_in_streak: this.getCheckInStreak(
                    logs.map((log) => log.logged_at),
                ),
                average_mood: this.roundToTwo(this.getAverage(moodScores)),
                sleep_quality: this.roundToTwo(
                    this.normalizeSleepQuality(this.getAverage(sleepHours)),
                ),
            },
            recent_mood_entries: logs.slice(0, 5).map((log) => ({
                mood_value: this.roundToTwo(
                    this.toMoodScore(
                        log.prediction?.mood_result ?? null,
                        log.sentiment_score,
                    ),
                ),
                created_at: log.created_at.toISOString(),
                notes: log.notes,
            })),
            weekly_mood_trend: this.buildWeeklyTrend(logs),
        };
    }

    async getInsightsForUser(userId: number): Promise<SummaryInsightsDto> {
        const logsWithPredictions = await this.prisma.mood_logs.findMany({
            where: {
                user_id: userId,
                prediction: {
                    isNot: null,
                },
            },
            orderBy: { created_at: 'desc' },
            select: {
                prediction: {
                    select: {
                        mood_result: true,
                        activity_suggestion: true,
                        confidence_score: true,
                    },
                },
            },
        });

        const latestPrediction = logsWithPredictions[0]?.prediction ?? null;
        let aiInsight: string | null = null;
        let recommendations: Array<{ name: string; description: string; duration: string }> = [];
        let factors: {
            stressors: Array<{ name: string; value: string; description: string }>;
            boosters: Array<{ name: string; value: string; description: string }>;
        } | null = null;

        if (latestPrediction) {
            const suggestionRaw = latestPrediction.activity_suggestion;
            try {
                const parsed = JSON.parse(suggestionRaw);
                if (parsed && typeof parsed === 'object' && 'ai_insight' in parsed) {
                    aiInsight = parsed.ai_insight;
                    recommendations = parsed.recommendations || [];
                    factors = parsed.factors || null;
                } else {
                    aiInsight = suggestionRaw;
                }
            } catch (err) {
                aiInsight = suggestionRaw;
            }
        }

        return {
            mood_prediction: latestPrediction
                ? {
                      predicted_mood: this.toMoodScore(
                          latestPrediction.mood_result,
                          null,
                      ),
                      confidence_score: this.roundToTwo(
                          latestPrediction.confidence_score,
                      ),
                  }
                : null,
            ai_insight: aiInsight,
            recommendations,
            factors,
        };
    }

    private buildWeeklyTrend(
        logs: Array<{
            logged_at: Date;
            sentiment_score: number | null;
            prediction: { mood_result: string } | null;
        }>,
    ) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setUTCHours(0, 0, 0, 0);
        sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

        const buckets = new Map<string, { total: number; count: number }>();

        for (const log of logs) {
            if (log.logged_at < sevenDaysAgo) {
                continue;
            }

            const dayKey = this.toDayKey(log.logged_at);
            const current = buckets.get(dayKey) ?? { total: 0, count: 0 };
            current.total += this.toMoodScore(
                log.prediction?.mood_result ?? null,
                log.sentiment_score,
            );
            current.count += 1;
            buckets.set(dayKey, current);
        }

        return Array.from(buckets.entries())
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([date, bucket]) => ({
                date,
                average_mood: this.roundToTwo(bucket.total / bucket.count),
            }));
    }

    private getCheckInStreak(logDates: Date[]) {
        const uniqueDays = Array.from(
            new Set(logDates.map((date) => this.toDayKey(date))),
        ).sort((left, right) => right.localeCompare(left));

        if (uniqueDays.length === 0) {
            return 0;
        }

        let streak = 0;
        const cursor = new Date(`${uniqueDays[0]}T00:00:00.000Z`);

        for (const day of uniqueDays) {
            if (day !== this.toDayKey(cursor)) {
                break;
            }

            streak += 1;
            cursor.setUTCDate(cursor.getUTCDate() - 1);
        }

        return streak;
    }

    private getAverage(values: number[]) {
        if (values.length === 0) {
            return 0;
        }

        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    private normalizeSleepQuality(averageSleepHours: number) {
        return Math.max(0, Math.min(10, (averageSleepHours / 8) * 10));
    }

    private toMoodScore(
        moodResult: string | null,
        sentimentScore: number | null,
    ) {
        if (moodResult === 'HAPPY') {
            return 10;
        }

        if (moodResult === 'NORMAL') {
            return 6;
        }

        if (moodResult === 'STRESS') {
            return 2;
        }

        if (sentimentScore === null) {
            return 5;
        }

        if (sentimentScore >= 0 && sentimentScore <= 1) {
            return Math.max(1, Math.min(10, sentimentScore * 10));
        }

        if (sentimentScore >= -1 && sentimentScore < 0) {
            return Math.max(1, Math.min(10, ((sentimentScore + 1) / 2) * 10));
        }

        return Math.max(1, Math.min(10, sentimentScore));
    }

    private toDayKey(date: Date) {
        return date.toISOString().slice(0, 10);
    }

    private roundToTwo(value: number) {
        return Math.round(value * 100) / 100;
    }
}
