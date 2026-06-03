import type { MoodForecast } from './prediction-service';

export interface ForecastCacheRepository {
    get(userId: number): Promise<MoodForecast | null>;
    set(userId: number, forecast: MoodForecast): Promise<void>;
    invalidate(userId: number): Promise<void>;
}
