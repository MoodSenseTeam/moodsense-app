import { z } from 'zod';

export const forecastDaySchema = z.object({
    day: z.string(),
    date: z.string(),
    predicted_mood: z.number(),
    label: z.string(),
    confidence: z.number(),
});

export const moodForecastSchema = z.object({
    forecasts: z.array(forecastDaySchema),
    trend_direction: z.string(),
    trend_analysis: z.string(),
    prevention_tips: z.array(z.string()),
    boost_tips: z.array(z.string()),
});

export type MoodForecastDto = z.infer<typeof moodForecastSchema>;
