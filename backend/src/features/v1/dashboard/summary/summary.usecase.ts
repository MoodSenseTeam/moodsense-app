import type { SummaryInsightsDto, SummaryDto } from './summary.dto';
import type { SummaryRepository } from '@/shared/ports/summary.repository';

export class GetSummaryUseCase {
    constructor(private readonly summaryRepository: SummaryRepository) {}

    async execute(userId: number): Promise<SummaryDto> {
        return this.summaryRepository.getSummaryForUser(userId);
    }

    async getInsights(userId: number): Promise<SummaryInsightsDto> {
        return this.summaryRepository.getInsightsForUser(userId);
    }
}