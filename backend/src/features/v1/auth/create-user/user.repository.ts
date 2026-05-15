import type { CreateUserDto } from './create-user.dto';

export interface UserRepository {
    findByEmail(email: string): Promise<{ user_id: number, email: string } | null>;
    create(data: CreateUserDto & { password: string }): Promise<{ user_id: number; name: string; email: string }>;
}