import type { CreateCheckinDto, CreatedCheckinDto } from './checkin.dto';
import type { CheckinRepository } from '@/shared/ports/checkin.repository';
import type { PredictionService } from '@/shared/ports/prediction-service';

export class CreateCheckinUseCase {
    constructor(
        private readonly checkinRepository: CheckinRepository,
        private readonly predictionService: PredictionService,
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

        // 2. Generate customized activity suggestion
        let activitySuggestion = 'Tetap jaga keseimbangan kesehatan fisik dan mental Anda.';
        if (moodResultUpper === 'STRESS') {
            activitySuggestion = 'Ambil jeda istirahat 15 menit, lakukan latihan pernapasan kotak (box breathing), atau dengarkan musik tenang.';
        } else if (moodResultUpper === 'NORMAL') {
            activitySuggestion = 'Pertahankan ritme belajarmu saat ini! Cobalah berjalan kaki singkat di luar ruangan untuk menjaga kesegaran pikiran.';
        } else if (moodResultUpper === 'HAPPY') {
            activitySuggestion = 'Luar biasa! Salurkan energi positifmu hari ini dengan berolahraga, bersosialisasi dengan teman, atau mendalami hobi.';
        }

        // 3. Write checkin and prediction atomically
        return this.checkinRepository.create(userId, input, {
            mood_result: moodResultUpper,
            confidence_score: prediction.confidence,
            activity_suggestion: activitySuggestion,
        });
    }
}
