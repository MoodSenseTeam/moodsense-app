import type { PrismaClient } from '@/shared/db/generated/client/client';

import { Router } from 'express';
import { JwtTokenService } from '@/infrastructure/security/token-service';
import { PrismaSummaryRepository } from '@/infrastructure/dashboard/prisma-summary.repository';
import { GetSummaryUseCase } from '@/features/v1/dashboard/summary/summary.usecase';
import { SummaryController } from '@/features/v1/dashboard/summary/summary.controller';
import { createSummaryRoutes } from '@/features/v1/dashboard/summary/summary.router';
import { PrismaCheckinRepository } from '@/infrastructure/dashboard/prisma-checkin.repository';
import { HttpPredictionService } from '@/infrastructure/prediction/http-prediction.service';
import { CreateCheckinUseCase } from '@/features/v1/dashboard/checkin/checkin.usecase';
import { GetCheckinHistoryUseCase } from '@/features/v1/dashboard/checkin/checkin-history.usecase';
import { CheckinController } from '@/features/v1/dashboard/checkin/checkin.controller';
import { CheckinHistoryController } from '@/features/v1/dashboard/checkin/checkin-history.controller';
import { createCheckinRoutes } from '@/features/v1/dashboard/checkin/checkin.router';
import { PrismaTodoRepository } from '@/infrastructure/dashboard/prisma-todo.repository';
import { ListTodosUseCase, CreateTodoUseCase, ToggleTodoUseCase, DeleteTodoUseCase, SyncTodosUseCase } from '@/features/v1/dashboard/todos/todo.usecase';
import { TodoController } from '@/features/v1/dashboard/todos/todo.controller';
import { createTodoRoutes } from '@/features/v1/dashboard/todos/todo.router';
import { requireAccessToken } from '@/shared/middleware/require-access-token';

export function createDashboardModule(prisma: PrismaClient): Router {
    const router = Router();
    const tokenService = new JwtTokenService();

    router.use(requireAccessToken(tokenService));

    // Todo
    const todoRepository = new PrismaTodoRepository(prisma);
    const listTodosUseCase = new ListTodosUseCase(todoRepository);
    const createTodoUseCase = new CreateTodoUseCase(todoRepository);
    const toggleTodoUseCase = new ToggleTodoUseCase(todoRepository);
    const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);
    const syncTodosUseCase = new SyncTodosUseCase(todoRepository);
    const todoController = new TodoController(listTodosUseCase, createTodoUseCase, toggleTodoUseCase, deleteTodoUseCase);
    router.use(createTodoRoutes(todoController));

    // Summary
    const summaryRepository = new PrismaSummaryRepository(prisma);
    const getSummaryUseCase = new GetSummaryUseCase(summaryRepository, syncTodosUseCase);
    const summaryController = new SummaryController(getSummaryUseCase);
    router.use(createSummaryRoutes(summaryController));

    // Check-in
    const predictionService = new HttpPredictionService();
    const checkinRepository = new PrismaCheckinRepository(prisma);

    const createCheckinUseCase = new CreateCheckinUseCase(checkinRepository, predictionService);
    const checkinController = new CheckinController(createCheckinUseCase);

    const getCheckinHistoryUseCase = new GetCheckinHistoryUseCase(checkinRepository);
    const checkinHistoryController = new CheckinHistoryController(getCheckinHistoryUseCase);

    router.use(createCheckinRoutes(checkinController, checkinHistoryController));

    return router;
}

