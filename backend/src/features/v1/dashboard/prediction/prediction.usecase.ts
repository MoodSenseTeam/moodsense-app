import type { PredictionService, MoodForecast } from '@/shared/ports/prediction-service';
import type { SummaryRepository } from '@/shared/ports/summary.repository';
import type { ForecastCacheRepository } from '@/shared/ports/forecast-cache.repository';

export class GetPredictionUseCase {
    constructor(
        private readonly summaryRepository: SummaryRepository,
        private readonly predictionService: PredictionService,
        private readonly forecastCache: ForecastCacheRepository,
    ) {}

    async execute(userId: number): Promise<MoodForecast> {
        // Return cached forecast if still valid (generated today)
        const cached = await this.forecastCache.get(userId);
        if (cached) {
            return cached;
        }

        const summary = await this.summaryRepository.getSummaryForUser(userId);
        const insights = await this.summaryRepository.getInsightsForUser(userId);

        const forecast = await this.predictionService.getForecast({
            weekly_trend: summary.weekly_mood_trend,
            average_mood: summary.overview.average_mood,
            sleep_quality: summary.overview.sleep_quality,
            check_in_streak: summary.overview.check_in_streak,
            latest_mood: insights.mood_prediction
                ? this.toExtendedMood(insights.mood_prediction.predicted_mood)
                : null,
        });

        // Cache the forecast for the rest of the day
        await this.forecastCache.set(userId, forecast);

        return forecast;
    }

    private toExtendedMood(score: number): string | null {
        if (score >= 8.5) return 'VERY_HAPPY';
        if (score >= 6.5) return 'HAPPY';
        if (score >= 4.5) return 'NORMAL';
        if (score >= 2.5) return 'STRESS';
        return 'VERY_STRESS';
    }
}
