import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@/shared/db/generated/client/client';
import { getConfig } from '@/shared/config';

export function createPrismaClient() {
    const { databaseUrl } = getConfig();

    return new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
}
