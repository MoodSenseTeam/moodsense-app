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

export interface ForecastDay {
    day: string;
    date: string;
    predicted_mood: number;
    label: string;
    confidence: number;
}

export interface MoodForecast {
    forecasts: ForecastDay[];
    trend_direction: string;
    trend_analysis: string;
    prevention_tips: string[];
    boost_tips: string[];
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

    getForecast(params: {
        weekly_trend: Array<{ date: string; average_mood: number }>;
        average_mood: number;
        sleep_quality: number;
        check_in_streak: number;
        latest_mood: string | null;
    }): Promise<MoodForecast>;
}
