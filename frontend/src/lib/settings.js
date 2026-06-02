import { apiRequest } from "./api";

export async function fetchSettings(token) {
  return apiRequest("/settings", {
    method: "GET",
    token,
  });
}

export async function updateSettings(token, data) {
  return apiRequest("/settings", {
    method: "PATCH",
    token,
    body: data,
  });
}

export async function updateProfile(token, data) {
  return apiRequest("/settings/profile", {
    method: "PATCH",
    token,
    body: data,
  });
}

export async function changePassword(token, data) {
  return apiRequest("/settings/change-password", {
    method: "POST",
    token,
    body: data,
  });
}
