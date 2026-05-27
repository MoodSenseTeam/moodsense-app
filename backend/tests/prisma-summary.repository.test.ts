import { afterEach, describe, expect, it, vi } from 'vitest';

import { PrismaSummaryRepository } from '../src/infrastructure/dashboard/prisma-summary.repository';
import type { PrismaClient } from '../src/shared/db/generated/client/client';

describe('PrismaSummaryRepository', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('builds the core dashboard summary from mood logs', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-05-27T12:00:00.000Z'));

        const findMany = vi
            .fn()
            .mockResolvedValueOnce([
                {
                    created_at: new Date('2026-05-27T08:00:00.000Z'),
                    logged_at: new Date('2026-05-27T08:00:00.000Z'),
                    sleep_hours: 8,
                    sentiment_score: 0.8,
                    notes: 'Good day',
                    prediction: { mood_result: 'HAPPY' },
                },
                {
                    created_at: new Date('2026-05-26T08:00:00.000Z'),
                    logged_at: new Date('2026-05-26T08:00:00.000Z'),
                    sleep_hours: 6,
                    sentiment_score: null,
                    notes: null,
                    prediction: null,
                },
                {
                    created_at: new Date('2026-05-25T08:00:00.000Z'),
                    logged_at: new Date('2026-05-25T08:00:00.000Z'),
                    sleep_hours: 7,
                    sentiment_score: -0.5,
                    notes: 'Okay',
                    prediction: { mood_result: 'NORMAL' },
                },
                {
                    created_at: new Date('2026-05-24T08:00:00.000Z'),
                    logged_at: new Date('2026-05-24T08:00:00.000Z'),
                    sleep_hours: 4,
                    sentiment_score: 0.2,
                    notes: 'Tired',
                    prediction: { mood_result: 'STRESS' },
                },
                {
                    created_at: new Date('2026-05-23T08:00:00.000Z'),
                    logged_at: new Date('2026-05-23T08:00:00.000Z'),
                    sleep_hours: 5,
                    sentiment_score: 1.2,
                    notes: 'Entry 5',
                    prediction: null,
                },
                {
                    created_at: new Date('2026-05-20T08:00:00.000Z'),
                    logged_at: new Date('2026-05-20T08:00:00.000Z'),
                    sleep_hours: 9,
                    sentiment_score: 0.6,
                    notes: 'Older entry',
                    prediction: { mood_result: 'HAPPY' },
                },
            ])
            .mockResolvedValueOnce([]);

        const prisma = {
            mood_logs: {
                findMany,
            },
        } as unknown as PrismaClient;

        const repository = new PrismaSummaryRepository(prisma);

        const result = await repository.getSummaryForUser(42);

        expect(findMany).toHaveBeenCalledTimes(1);
        expect(findMany).toHaveBeenCalledWith({
            where: { user_id: 42 },
            orderBy: { created_at: 'desc' },
            select: {
                created_at: true,
                logged_at: true,
                sleep_hours: true,
                sentiment_score: true,
                notes: true,
                prediction: {
                    select: {
                        mood_result: true,
                    },
                },
            },
        });

        expect(result).toEqual({
            overview: {
                check_in_streak: 5,
                average_mood: 5.7,
                sleep_quality: 8.13,
            },
            recent_mood_entries: [
                {
                    mood_value: 10,
                    created_at: '2026-05-27T08:00:00.000Z',
                    notes: 'Good day',
                },
                {
                    mood_value: 5,
                    created_at: '2026-05-26T08:00:00.000Z',
                    notes: null,
                },
                {
                    mood_value: 6,
                    created_at: '2026-05-25T08:00:00.000Z',
                    notes: 'Okay',
                },
                {
                    mood_value: 2,
                    created_at: '2026-05-24T08:00:00.000Z',
                    notes: 'Tired',
                },
                {
                    mood_value: 1.2,
                    created_at: '2026-05-23T08:00:00.000Z',
                    notes: 'Entry 5',
                },
            ],
            weekly_mood_trend: [
                {
                    date: '2026-05-23',
                    average_mood: 1.2,
                },
                {
                    date: '2026-05-24',
                    average_mood: 2,
                },
                {
                    date: '2026-05-25',
                    average_mood: 6,
                },
                {
                    date: '2026-05-26',
                    average_mood: 5,
                },
                {
                    date: '2026-05-27',
                    average_mood: 10,
                },
            ],
        });
    });

    it('builds insights from the latest prediction logs', async () => {
        const findMany = vi
            .fn()
            .mockResolvedValueOnce([
                {
                    prediction: {
                        mood_result: 'NORMAL',
                        activity_suggestion: 'Take a short walk',
                        confidence_score: 0.876,
                    },
                },
                {
                    prediction: {
                        mood_result: 'HAPPY',
                        activity_suggestion: 'Take a short walk',
                        confidence_score: 0.5,
                    },
                },
                {
                    prediction: {
                        mood_result: 'STRESS',
                        activity_suggestion: 'Drink water',
                        confidence_score: 0.42,
                    },
                },
                {
                    prediction: {
                        mood_result: 'HAPPY',
                        activity_suggestion: 'Sleep earlier',
                        confidence_score: 0.99,
                    },
                },
            ])
            .mockResolvedValueOnce([]);

        const prisma = {
            mood_logs: {
                findMany,
            },
        } as unknown as PrismaClient;

        const repository = new PrismaSummaryRepository(prisma);

        const result = await repository.getInsightsForUser(7);

        expect(findMany).toHaveBeenCalledTimes(1);
        expect(findMany).toHaveBeenCalledWith({
            where: {
                user_id: 7,
                prediction: {
                    isNot: null,
                },
            },
            orderBy: { created_at: 'desc' },
            select: {
                prediction: {
                    select: {
                        mood_result: true,
                        activity_suggestion: true,
                        confidence_score: true,
                    },
                },
            },
        });

        expect(result).toEqual({
            mood_prediction: {
                predicted_mood: 6,
                confidence_score: 0.88,
            },
            recommendations: [
                'Take a short walk',
                'Drink water',
                'Sleep earlier',
            ],
        });
    });

    it('returns empty insights when no predictions exist', async () => {
        const findMany = vi.fn().mockResolvedValueOnce([]);

        const prisma = {
            mood_logs: {
                findMany,
            },
        } as unknown as PrismaClient;

        const repository = new PrismaSummaryRepository(prisma);

        await expect(repository.getInsightsForUser(99)).resolves.toEqual({
            mood_prediction: null,
            recommendations: [],
        });
    });
});
