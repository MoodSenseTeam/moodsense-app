-- CreateTable
CREATE TABLE "mood_forecasts" (
    "forecast_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "forecast_data" JSONB NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mood_forecasts_pkey" PRIMARY KEY ("forecast_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mood_forecasts_user_id_key" ON "mood_forecasts"("user_id");

-- AddForeignKey
ALTER TABLE "mood_forecasts" ADD CONSTRAINT "mood_forecasts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
