export type UserSettingsRow = {
    setting_id: number;
    user_id: number;
    theme: string;
    reminder_active: boolean;
    reminder_time: string;
    language: string;
};

export type SettingsUpdateData = {
    theme: string;
    reminder_active: boolean;
    reminder_time: string;
    language: string;
};

export interface SettingsRepository {
    findByUserId(userId: number): Promise<UserSettingsRow | null>;
    upsert(
        userId: number,
        data: Partial<SettingsUpdateData>,
    ): Promise<UserSettingsRow>;
}
