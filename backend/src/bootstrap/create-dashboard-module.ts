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
import { requireAccessToken } from '@/shared/middleware/require-access-token';

export function createDashboardModule(prisma: PrismaClient): Router {
    const router = Router();
    const tokenService = new JwtTokenService();

    router.use(requireAccessToken(tokenService));

    // Summary
    const summaryRepository = new PrismaSummaryRepository(prisma);
    const getSummaryUseCase = new GetSummaryUseCase(summaryRepository);
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

