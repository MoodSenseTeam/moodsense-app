import type { CreateUserDto } from '../../features/v1/auth/create-user/create-user.dto';

export interface UserRepository {
    findByEmail(email: string): Promise<{ user_id: number, email: string } | null>;
    findByEmailWithPassword(email: string): Promise<{ user_id: number; name: string; email: string; password: string } | null>
    create(data: CreateUserDto & { password: string }): Promise<{ user_id: number; name: string; email: string }>;
    upsertCredentials?(userId: number, refreshToken: string, expiresAt: Date): Promise<void>;
    updateLastLogin?(userId: number, lastLoginAt: Date): Promise<void>;
    findCredentialsByUserId?(userId: number): Promise<{ user_id: number; refresh_token: string | null; token_expires: Date | null; is_active: boolean } | null>;
    revokeCredentials?(userId: number): Promise<void>;
}