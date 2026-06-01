import type { PredictionService } from '@/shared/ports/prediction-service';

export class HttpPredictionService implements PredictionService {
    private readonly apiUrl = process.env.ML_API_URL || 'http://localhost:8000';

    async predict(params: {
        text: string;
        sleep_hours?: number;
        activity_level?: string;
        how_you_feeling?: string;
    }): Promise<{
        predicted_mood: 'stress' | 'happy' | 'normal';
        confidence: number;
    }> {
        try {
            const response = await fetch(`${this.apiUrl}/api/v1/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`ML API returned status ${response.status}`);
            }

            const data = await response.json();
            return {
                predicted_mood: data.predicted_mood,
                confidence: data.confidence,
            };
        } catch (error) {
            console.error('ML Prediction request failed, utilizing rule-based fallback:', error);
            
            // Fail-safe Rule-Based Fallback to avoid breaking checkins if ML API is offline
            const feeling = params.how_you_feeling?.toLowerCase() || 'normal';
            let predicted: 'stress' | 'happy' | 'normal' = 'normal';
            if (feeling.includes('stress')) {
                predicted = 'stress';
            } else if (feeling.includes('happy')) {
                predicted = 'happy';
            }

            return {
                predicted_mood: predicted,
                confidence: 0.5,
            };
        }
    }
}
