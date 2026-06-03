import { apiRequest } from "./api";

export async function fetchTodos(token) {
  return apiRequest("/dashboard/todos", {
    method: "GET",
    token,
  });
}

export async function toggleTodo(todoId, token) {
  return apiRequest(`/dashboard/todos/${todoId}/toggle`, {
    method: "PATCH",
    token,
  });
}
