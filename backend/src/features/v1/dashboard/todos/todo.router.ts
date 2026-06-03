import { Router } from 'express';
import type { TodoController } from './todo.controller';

export function createTodoRoutes(todoController: TodoController) {
    const router = Router();

    router.get('/todos', (req, res) => {
        return todoController.getTodos(req, res);
    });

    router.post('/todos', (req, res) => {
        return todoController.createTodo(req, res);
    });

    router.patch('/todos/:id/toggle', (req, res) => {
        return todoController.toggleTodo(req, res);
    });

    router.delete('/todos/:id', (req, res) => {
        return todoController.deleteTodo(req, res);
    });

    return router;
}
