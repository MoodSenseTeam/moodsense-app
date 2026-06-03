import type { TodoRepository, TodoItem } from '@/shared/ports/todo.repository';

export class ListTodosUseCase {
    constructor(private readonly todoRepository: TodoRepository) {}

    async execute(userId: number): Promise<TodoItem[]> {
        return this.todoRepository.listByUser(userId);
    }
}

export class ToggleTodoUseCase {
    constructor(private readonly todoRepository: TodoRepository) {}

    async execute(todoId: number, userId: number): Promise<TodoItem> {
        return this.todoRepository.toggle(todoId, userId);
    }
}

export class SyncTodosUseCase {
    constructor(private readonly todoRepository: TodoRepository) {}

    async execute(
        userId: number,
        recommendations: Array<{ name: string; description: string; duration: string }>,
    ): Promise<void> {
        if (recommendations.length === 0) {
            return;
        }
        await this.todoRepository.upsert(userId, recommendations);
    }
}
