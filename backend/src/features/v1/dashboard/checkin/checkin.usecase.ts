import type { CreateCheckinDto, CreatedCheckinDto } from './checkin.dto';
import type { CheckinRepository } from '@/shared/ports/checkin.repository';
import type { PredictionService } from '@/shared/ports/prediction-service';
import type { ForecastCacheRepository } from '@/shared/ports/forecast-cache.repository';

export class CreateCheckinUseCase {
    constructor(
        private readonly checkinRepository: CheckinRepository,
        private readonly predictionService: PredictionService,
        private readonly forecastCache: ForecastCacheRepository,
    ) { }

    async execute(
        userId: number,
        input: CreateCheckinDto,
    ): Promise<CreatedCheckinDto> {
        const alreadyCheckedIn =
            await this.checkinRepository.hasCheckinToday(userId);

        if (alreadyCheckedIn) {
            throw new Error('You have already checked in today');
        }

        // 1. Get late fusion prediction from the ML API
        const prediction = await this.predictionService.predict({
            text: input.notes || 'daily checkin',
            sleep_hours: input.sleep_hours,
            activity_level: input.activity_level,
            how_you_feeling: input.how_you_feeling,
        });

        const moodResultUpper = prediction.predicted_mood.toUpperCase() as 'STRESS' | 'HAPPY' | 'NORMAL';

        // 2. Get GenAI-powered insight and factors in parallel
        const [insightRes, factorsRes] = await Promise.all([
            this.predictionService.getInsight({
                sleep_hours: input.sleep_hours,
                activity_level: input.activity_level,
                study_hours: input.study_hours,
                social_score: input.social_score,
                how_you_feeling: input.how_you_feeling,
                notes: input.notes ?? undefined,
            }),
            this.predictionService.getFactors({
                sleep_hours: input.sleep_hours,
                activity_level: input.activity_level,
                study_hours: input.study_hours,
                social_score: input.social_score,
                how_you_feeling: input.how_you_feeling,
                notes: input.notes ?? undefined,
            }),
        ]);

        const combinedSuggestion = JSON.stringify({
            ai_insight: insightRes.insight,
            recommendations: insightRes.recommendations,
            factors: factorsRes,
        });

        // 3. Invalidate stale forecast cache (new data = need fresh forecast)
        await this.forecastCache.invalidate(userId);

        // 4. Write checkin and prediction atomically
        return this.checkinRepository.create(userId, input, {
            mood_result: moodResultUpper,
            confidence_score: prediction.confidence,
            activity_suggestion: combinedSuggestion,
        });
    }
}
