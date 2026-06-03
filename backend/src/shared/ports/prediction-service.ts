export interface PredictionInsight {
    insight: string;
    recommendations: Array<{
        name: string;
        description: string;
        duration: string;
    }>;
}

export interface PredictionFactors {
    stressors: Array<{
        name: string;
        value: string;
        description: string;
    }>;
    boosters: Array<{
        name: string;
        value: string;
        description: string;
    }>;
}

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

    getInsight(params: {
        sleep_hours: number;
        activity_level: string;
        study_hours: number;
        social_score: number;
        how_you_feeling: string;
        notes?: string;
    }): Promise<PredictionInsight>;

    getFactors(params: {
        sleep_hours: number;
        activity_level: string;
        study_hours: number;
        social_score: number;
        how_you_feeling: string;
        notes?: string;
    }): Promise<PredictionFactors>;
}
