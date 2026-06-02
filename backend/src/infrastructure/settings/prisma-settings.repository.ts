import type { PrismaClient } from '@/shared/db/generated/client/client';
import type {
    SettingsRepository,
    UserSettingsRow,
    SettingsUpdateData,
} from '@/shared/ports/settings.repository';

const SELECT_FIELDS = {
    setting_id: true,
    user_id: true,
    theme: true,
    reminder_active: true,
    reminder_time: true,
    language: true,
} as const;

export class PrismaSettingsRepository implements SettingsRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findByUserId(userId: number): Promise<UserSettingsRow | null> {
        return this.prisma.user_settings.findUnique({
            where: { user_id: userId },
            select: SELECT_FIELDS,
        });
    }

    async upsert(
        userId: number,
        data: Partial<SettingsUpdateData>,
    ): Promise<UserSettingsRow> {
        return this.prisma.user_settings.upsert({
            where: { user_id: userId },
            create: {
                user: { connect: { user_id: userId } },
                ...data,
            },
            update: data,
            select: SELECT_FIELDS,
        });
    }
}
