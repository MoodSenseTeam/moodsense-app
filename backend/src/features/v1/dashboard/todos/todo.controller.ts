import type { Request, Response } from 'express';
import { ListTodosUseCase, CreateTodoUseCase, ToggleTodoUseCase, DeleteTodoUseCase } from './todo.usecase';
import { createTodoSchema } from './todo.dto';

export class TodoController {
    constructor(
        private readonly listTodosUseCase: ListTodosUseCase,
        private readonly createTodoUseCase: CreateTodoUseCase,
        private readonly toggleTodoUseCase: ToggleTodoUseCase,
        private readonly deleteTodoUseCase: DeleteTodoUseCase,
    ) {}

    async getTodos(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const todos = await this.listTodosUseCase.execute(userId);
        return res.status(200).json({ data: todos });
    }

    async createTodo(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const input = createTodoSchema.parse(req.body);
        const created = await this.createTodoUseCase.execute(userId, input);
        return res.status(201).json({ data: created });
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

    async deleteTodo(req: Request, res: Response) {
        const userId = req.user?.user_id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const todoId = parseInt(String(req.params.id), 10);
        if (isNaN(todoId)) {
            return res.status(400).json({ message: 'Invalid todo ID' });
        }

        try {
            await this.deleteTodoUseCase.execute(todoId, userId);
            return res.status(200).json({ message: 'Todo deleted' });
        } catch (error) {
            if (error instanceof Error && error.message === 'Todo item not found') {
                return res.status(404).json({ message: 'Todo item not found' });
            }
            throw error;
        }
    }
}
