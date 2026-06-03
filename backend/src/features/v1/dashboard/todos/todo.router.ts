import { Router } from 'express';
import type { TodoController } from './todo.controller';

export function createTodoRoutes(todoController: TodoController) {
    const router = Router();

    router.get('/todos', (req, res) => {
        return todoController.getTodos(req, res);
    });

    router.patch('/todos/:id/toggle', (req, res) => {
        return todoController.toggleTodo(req, res);
    });

    return router;
}
