-- CreateEnum
CREATE TYPE "MoodExtended" AS ENUM ('VERY_HAPPY', 'HAPPY', 'NORMAL', 'STRESS', 'VERY_STRESS');

-- AlterTable
ALTER TABLE "mood_logs" ADD COLUMN     "how_you_feeling" "MoodExtended";
