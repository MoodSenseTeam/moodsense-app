import { apiRequest } from "./api";

export async function fetchTodos(token) {
  return apiRequest("/dashboard/todos", {
    method: "GET",
    token,
  });
}

export async function createTodo(data, token) {
  return apiRequest("/dashboard/todos", {
    method: "POST",
    token,
    body: data,
  });
}

export async function toggleTodo(todoId, token) {
  return apiRequest(`/dashboard/todos/${todoId}/toggle`, {
    method: "PATCH",
    token,
  });
}

export async function deleteTodo(todoId, token) {
  return apiRequest(`/dashboard/todos/${todoId}`, {
    method: "DELETE",
    token,
  });
}
