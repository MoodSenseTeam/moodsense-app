import { z } from "zod";

export const summarySchema = z.object({
  check_in_streak: z.number(),
  average_mood: z.number(),
  sleep_quality: z.number(),
  recent_mood_entries: z.array(
    z.object({
      mood_value: z.number(),
      created_at: z.string(),
      notes: z.string().nullable(),
    }),
  ),
  mood_prediction: z
    .object({
      predicted_mood: z.number(),
      confidence_score: z.number(),
    })
    .nullable(),
  reccomendations: z.array(z.string()),
});
