import type { PrismaClient } from '@/shared/db/generated/client/client';

import { Router } from 'express';
import { PrismaSummaryRepository } from '@/infrastructure/dashboard/prisma-summary.repository';
import { GetSummaryUseCase } from '@/features/v1/dashboard/summary/summary.usecase';
import { SummaryController } from '@/features/v1/dashboard/summary/summary.controller';
import { createSummaryRoutes } from '@/features/v1/dashboard/summary/summary.router';

export function createDashboardModule(prisma: PrismaClient): Router {
    const router = Router();

    const summaryRepository = new PrismaSummaryRepository(prisma);
    const getSummaryUseCase = new GetSummaryUseCase(summaryRepository);
    const summaryController = new SummaryController(getSummaryUseCase);
    router.use(createSummaryRoutes(summaryController));

    return router;
}

