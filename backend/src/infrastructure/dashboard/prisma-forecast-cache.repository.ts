import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { ForecastCacheRepository } from '@/shared/ports/forecast-cache.repository';
import type { MoodForecast } from '@/shared/ports/prediction-service';

export class PrismaForecastCacheRepository implements ForecastCacheRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async get(userId: number): Promise<MoodForecast | null> {
        const today = new Date().toISOString().slice(0, 10);

        const row = await this.prisma.mood_forecasts.findUnique({
            where: { user_id: userId },
            select: { forecast_data: true, generated_at: true },
        });

        if (!row) return null;

        // Only return cached if generated today
        const generatedDay = row.generated_at.toISOString().slice(0, 10);
        if (generatedDay !== today) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return row.forecast_data as any as MoodForecast;
    }

    async set(userId: number, forecast: MoodForecast): Promise<void> {
        await this.prisma.mood_forecasts.upsert({
            where: { user_id: userId },
            create: {
                user_id: userId,
                forecast_data: forecast as any,
            },
            update: {
                forecast_data: forecast as any,
                generated_at: new Date(),
            },
        });
    }

    async invalidate(userId: number): Promise<void> {
        await this.prisma.mood_forecasts.deleteMany({
            where: { user_id: userId },
        });
    }
}
