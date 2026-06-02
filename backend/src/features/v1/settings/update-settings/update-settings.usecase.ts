import type { UpdateSettingsDto } from './update-settings.dto';
import type { SettingsRepository } from '@/shared/ports/settings.repository';

export class UpdateSettingsUseCase {
    constructor(private readonly settingsRepository: SettingsRepository) {}

    async execute(userId: number, input: UpdateSettingsDto) {
        return this.settingsRepository.upsert(userId, input);
    }
}
