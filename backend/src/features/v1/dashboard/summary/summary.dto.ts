import { z } from "zod";

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

export const summaryInsightsSchema = z.object({
  mood_prediction: summaryPredictionSchema.nullable(),
  recommendations: z.array(z.string()),
});

export type SummaryInsightsDto = z.infer<typeof summaryInsightsSchema>;

export const summarySchema = z.object({
  overview: summaryOverviewSchema,
  recent_mood_entries: z.array(summaryRecentMoodEntrySchema),
  weekly_mood_trend: z.array(summaryTrendPointSchema),
});

export type SummaryDto = z.infer<typeof summarySchema>;
