import type { PrismaClient } from '@/shared/db/generated/client/client';

import { Router } from 'express';
import { JwtTokenService } from '@/infrastructure/security/token-service';
import { PrismaSummaryRepository } from '@/infrastructure/dashboard/prisma-summary.repository';
import { GetSummaryUseCase } from '@/features/v1/dashboard/summary/summary.usecase';
import { SummaryController } from '@/features/v1/dashboard/summary/summary.controller';
import { createSummaryRoutes } from '@/features/v1/dashboard/summary/summary.router';
import { requireAccessToken } from '@/shared/middleware/require-access-token';

export function createDashboardModule(prisma: PrismaClient): Router {
    const router = Router();
    const tokenService = new JwtTokenService();

    const summaryRepository = new PrismaSummaryRepository(prisma);
    const getSummaryUseCase = new GetSummaryUseCase(summaryRepository);
    const summaryController = new SummaryController(getSummaryUseCase);
    router.use(requireAccessToken(tokenService));
    router.use(createSummaryRoutes(summaryController));

    return router;
}

