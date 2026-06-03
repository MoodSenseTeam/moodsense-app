import { z } from 'zod';

const summaryRecentMoodEntrySchema = z.object({
    mood_value: z.number(),
    created_at: z.string(),
    notes: z.string().nullable(),
});

const summaryTrendPointSchema = z.object({
    date: z.string(),
    average_mood: z.number(),
});

const summaryPredictionSchema = z.object({
    predicted_mood: z.number(),
    confidence_score: z.number(),
});

export const summaryOverviewSchema = z.object({
    check_in_streak: z.number(),
    average_mood: z.number(),
    sleep_quality: z.number(),
});

export type SummaryOverviewDto = z.infer<typeof summaryOverviewSchema>;

const recommendationSchema = z.object({
    name: z.string(),
    description: z.string(),
    duration: z.string(),
});

const factorSchema = z.object({
    name: z.string(),
    value: z.string(),
    description: z.string(),
});

export const summaryInsightsSchema = z.object({
    mood_prediction: summaryPredictionSchema.nullable(),
    ai_insight: z.string().nullable(),
    recommendations: z.array(recommendationSchema),
    factors: z.object({
        stressors: z.array(factorSchema),
        boosters: z.array(factorSchema),
    }).nullable(),
});

export type SummaryInsightsDto = z.infer<typeof summaryInsightsSchema>;

export const summarySchema = z.object({
    overview: summaryOverviewSchema,
    recent_mood_entries: z.array(summaryRecentMoodEntrySchema),
    weekly_mood_trend: z.array(summaryTrendPointSchema),
});

export type SummaryDto = z.infer<typeof summarySchema>;
