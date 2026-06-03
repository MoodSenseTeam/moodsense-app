import { z } from 'zod';

export const todoItemSchema = z.object({
    todo_id: z.number(),
    user_id: z.number(),
    name: z.string(),
    description: z.string(),
    duration: z.string(),
    is_completed: z.boolean(),
    completed_at: z.string().nullable(),
    created_at: z.string(),
});

export type TodoItemDto = z.infer<typeof todoItemSchema>;

export const todoListResponseSchema = z.object({
    data: z.array(todoItemSchema),
});

export type TodoListResponseDto = z.infer<typeof todoListResponseSchema>;
