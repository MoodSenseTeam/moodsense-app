import { apiRequest } from "./api";

export const feelingOptions = [
  {
    value: "VERY_HAPPY",
    label: "Sangat Bahagia",
    emoji: "🤩",
    description: "Energi tinggi dan perasaan sangat positif.",
  },
  {
    value: "HAPPY",
    label: "Bahagia",
    emoji: "😊",
    description: "Mood positif dan cukup stabil.",
  },
  {
    value: "NORMAL",
    label: "Biasa Saja",
    emoji: "🙂",
    description: "Kondisi netral, masih terjaga.",
  },
  {
    value: "STRESS",
    label: "Stres",
    emoji: "😣",
    description: "Sedang banyak tekanan atau lelah mental.",
  },
  {
    value: "VERY_STRESS",
    label: "Sangat Stres",
    emoji: "😫",
    description: "Butuh jeda dan perhatian ekstra.",
  },
];

export const activityOptions = [
  {
    value: "NONE",
    label: "Tidak Ada",
    description: "Hari ini hampir tidak ada aktivitas fisik.",
  },
  {
    value: "LOW",
    label: "Ringan",
    description: "Aktivitas ringan seperti jalan pendek.",
  },
  {
    value: "MODERATE",
    label: "Sedang",
    description: "Ada aktivitas yang cukup seimbang.",
  },
  {
    value: "HIGH",
    label: "Tinggi",
    description: "Aktivitas fisik cukup intens.",
  },
];

export function getFeelingOption(value) {
  return feelingOptions.find((option) => option.value === value) ?? feelingOptions[2];
}

export function getActivityOption(value) {
  return activityOptions.find((option) => option.value === value) ?? activityOptions[1];
}

export async function submitCheckin(token, payload) {
  return apiRequest("/dashboard/checkin", {
    method: "POST",
    token,
    body: payload,
  });
}