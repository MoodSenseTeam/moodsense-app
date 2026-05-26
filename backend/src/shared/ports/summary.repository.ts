import type { SummaryDto, SummaryInsightsDto } from '@/features/v1/dashboard/summary/summary.dto';


export interface SummaryRepository {
    getSummaryForUser(userId: number): Promise<SummaryDto>;
    getInsightsForUser(userId: number): Promise<SummaryInsightsDto>;
}