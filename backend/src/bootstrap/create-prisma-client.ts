import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/shared/db/generated/client/client';

export function createPrismaClient() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is required');
    }

    return new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
}
