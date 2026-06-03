import type { Request, Response } from 'express';
import { ListTodosUseCase, ToggleTodoUseCase } from './todo.usecase';

export class TodoController {
    constructor(
        private readonly listTodosUseCase: ListTodosUseCase,
        private readonly toggleTodoUseCase: ToggleTodoUseCase,
    ) {}

    async getTodos(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const todos = await this.listTodosUseCase.execute(userId);
        return res.status(200).json({ data: todos });
    }

    async toggleTodo(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const todoId = parseInt(String(req.params.id), 10);
        if (isNaN(todoId)) {
            return res.status(400).json({ message: 'Invalid todo ID' });
        }

        try {
            const updated = await this.toggleTodoUseCase.execute(todoId, userId);
            return res.status(200).json({ data: updated });
        } catch (error) {
            if (error instanceof Error && error.message === 'Todo item not found') {
                return res.status(404).json({ message: 'Todo item not found' });
            }
            throw error;
        }
    }
}
