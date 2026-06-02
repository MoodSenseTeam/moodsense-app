export interface PredictionService {
    predict(params: {
        text: string;
        sleep_hours?: number;
        activity_level?: string;
        how_you_feeling?: string;
    }): Promise<{
        predicted_mood: 'stress' | 'happy' | 'normal';
        confidence: number;
    }>;
}
