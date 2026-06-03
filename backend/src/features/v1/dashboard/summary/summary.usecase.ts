import type { SummaryInsightsDto, SummaryDto } from './summary.dto';
import type { SummaryRepository } from '@/shared/ports/summary.repository';
import { SyncTodosUseCase } from '../todos/todo.usecase';

export class GetSummaryUseCase {
    constructor(
        private readonly summaryRepository: SummaryRepository,
        private readonly syncTodosUseCase: SyncTodosUseCase,
    ) {}

    async execute(userId: number): Promise<SummaryDto> {
        return this.summaryRepository.getSummaryForUser(userId);
    }

    async getInsights(userId: number): Promise<SummaryInsightsDto> {
        const insights = await this.summaryRepository.getInsightsForUser(userId);

        // Auto-sync AI recommendations to the user's todo list
        if (insights.recommendations.length > 0) {
            await this.syncTodosUseCase.execute(userId, insights.recommendations);
        }

        return insights;
    }
}