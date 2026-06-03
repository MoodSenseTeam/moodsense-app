import { apiRequest } from "./api";

export async function fetchTodos(token) {
  return apiRequest("/todos", {
    method: "GET",
    token,
  });
}

export async function toggleTodo(todoId, token) {
  return apiRequest(`/todos/${todoId}/toggle`, {
    method: "PATCH",
    token,
  });
}
