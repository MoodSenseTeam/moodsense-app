import { apiRequest } from "./api";

const moodBands = [
  { max: 2.5, label: "Buruk", dotClass: "bg-red-400", status: "Perlu perhatian" },
  { max: 4.5, label: "Kurang", dotClass: "bg-orange-400", status: "Perlu istirahat" },
  { max: 6.5, label: "Biasa", dotClass: "bg-yellow-400", status: "Stabil" },
  { max: 8.5, label: "Baik", dotClass: "bg-emerald-500", status: "Kondisi Baik" },
  { max: Number.POSITIVE_INFINITY, label: "Luar Biasa", dotClass: "bg-emerald-500", status: "Kondisi Sangat Baik" },
];

const sleepBands = [
  { max: 3.5, label: "Kurang", accent: "text-red-500" },
  { max: 5.5, label: "Cukup", accent: "text-orange-500" },
  { max: 7.5, label: "Baik", accent: "text-emerald-500" },
  { max: Number.POSITIVE_INFINITY, label: "Sangat Baik", accent: "text-emerald-600" },
];

function formatDecimal(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getBand(score, bands) {
  return bands.find((band) => score <= band.max) ?? bands[bands.length - 1];
}

export function getMoodTone(score) {
  return getBand(score, moodBands);
}

export function getSleepTone(score) {
  return getBand(score, sleepBands);
}

export function formatTrendDay(dateValue) {
  return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(
    new Date(`${dateValue}T00:00:00.000Z`),
  );
}

export function formatRecentTimestamp(dateValue) {
  const date = new Date(dateValue);
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.toDateString() === now.toDateString()) {
    return `Hari ini ${timeFormatter.format(date)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return `Kemarin ${timeFormatter.format(date)}`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function buildDashboardViewModel(summary, insights) {
  const overview = summary?.overview ?? {
    check_in_streak: 0,
    average_mood: 0,
    sleep_quality: 0,
  };
  const recentEntries = summary?.recent_mood_entries ?? [];
  const trendPoints = summary?.weekly_mood_trend ?? [];
  const prediction = insights?.mood_prediction ?? null;
  const recommendations = insights?.recommendations ?? [];
  const latestEntry = recentEntries[0] ?? null;
  const averageTone = getMoodTone(overview.average_mood);
  const sleepTone = getSleepTone(overview.sleep_quality);
  const predictionTone = prediction ? getMoodTone(prediction.predicted_mood) : null;

  return {
    hasCheckedInToday: latestEntry
      ? new Date(latestEntry.created_at).toDateString() === new Date().toDateString()
      : false,
    stats: [
      {
        title: "Streak Check-in",
        value: `${overview.check_in_streak} Hari`,
        description: overview.check_in_streak > 0 ? "Konsisten" : "Mulai rutin",
        accent: "text-[#2b6a4f]",
      },
      {
        title: "Rata-rata Mood",
        value: `${formatDecimal(overview.average_mood)}/10`,
        description: averageTone.label,
        accent: averageTone.accent || "text-[#60766b]",
      },
      {
        title: "Kualitas Tidur",
        value: `${formatDecimal(overview.sleep_quality)}/10`,
        description: sleepTone.label,
        accent: sleepTone.accent,
      },
    ],
    chartData: trendPoints.map((point) => ({
      day: formatTrendDay(point.date),
      mood: point.average_mood,
    })),
    recentLogs: recentEntries.map((entry, index) => {
      const tone = getMoodTone(entry.mood_value);

      return {
        id: `${entry.created_at}-${index}`,
        mood: tone.label,
        note: entry.notes?.trim() || "Tanpa catatan",
        time: formatRecentTimestamp(entry.created_at),
        color: tone.dotClass,
      };
    }),
    prediction: prediction
      ? {
          title: `Mood cenderung ${predictionTone.label}`,
          score: `${Math.round(prediction.confidence_score * 100)}%`,
          status: predictionTone.status,
          factors: insights?.factors || null,
        }
      : null,
    recommendations,
    insight: insights?.ai_insight || (prediction
      ? `Rata-rata mood kamu ${formatDecimal(overview.average_mood)}/10 dengan prediksi ${predictionTone.label.toLowerCase()} dan tingkat keyakinan ${Math.round(prediction.confidence_score * 100)}%.`
      : `Belum ada prediksi yang cukup, tetapi rata-rata mood minggu ini berada di ${formatDecimal(overview.average_mood)}/10.`),
  };
}

export async function fetchDashboardSummary(token) {
  return apiRequest("/dashboard/summary", {
    method: "GET",
    token,
  });
}

export async function fetchDashboardInsights(token) {
  return apiRequest("/dashboard/summary/insights", {
    method: "GET",
    token,
  });
}

export async function fetchForecast(token) {
  return apiRequest("/dashboard/prediction/forecast", {
    method: "GET",
    token,
  });
}