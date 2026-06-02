import type { SettingsRepository } from '@/shared/ports/settings.repository';

const DEFAULT_SETTINGS = {
    theme: 'light',
    reminder_active: true,
    reminder_time: '20:00',
    language: 'id',
};

export class GetSettingsUseCase {
    constructor(private readonly settingsRepository: SettingsRepository) {}

    async execute(userId: number) {
        const settings = await this.settingsRepository.findByUserId(userId);

        if (!settings) {
            return { user_id: userId, ...DEFAULT_SETTINGS };
        }

        return settings;
    }
}
