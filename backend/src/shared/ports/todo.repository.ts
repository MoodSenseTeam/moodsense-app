export interface TodoItem {
    todo_id: number;
    user_id: number;
    name: string;
    description: string;
    duration: string;
    is_completed: boolean;
    completed_at: string | null;
    created_at: string;
}

export interface TodoRepository {
    listByUser(userId: number): Promise<TodoItem[]>;
    upsert(
        userId: number,
        items: Array<{ name: string; description: string; duration: string }>,
    ): Promise<void>;
    toggle(todoId: number, userId: number): Promise<TodoItem>;
}
