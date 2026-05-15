import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { CreateUserDto } from '../../features/v1/auth/create-user/create-user.dto';
import type { UserRepository } from '../../shared/ports/user.repository';

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByEmail(email: string) {
        return this.prisma.users.findUnique({
            where: { email },
            select: {
                user_id: true,
                email: true,
            },
        });
    }

    async findByEmailWithPassword(email: string): Promise<{ user_id: number; name: string; email: string; password: string } | null> {
        return this.prisma.users.findUnique({
            where: { email },
            select: {
                user_id: true,
                email: true,
                name: true,
                password: true,
            },
        })
    }

    async create(data: CreateUserDto) {
        const user = await this.prisma.users.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            },
            select: {
                user_id: true,
                name: true,
                email: true,
            },
        });

        return user;
    }

    async upsertCredentials(userId: number, refreshToken: string, expiresAt: Date) {
        await this.prisma.user_credentials.upsert({
            where: { user_id: userId },
            create: {
                user: { connect: { user_id: userId } },
                refresh_token: refreshToken,
                token_expires: expiresAt,
                last_login: new Date(),
                is_active: true,
            },
            update: {
                refresh_token: refreshToken,
                token_expires: expiresAt,
                last_login: new Date(),
                is_active: true,
            },
        });
    }

    async updateLastLogin(userId: number, lastLoginAt: Date) {
        await this.prisma.user_credentials.upsert({
            where: { user_id: userId },
            create: {
                user: { connect: { user_id: userId } },
                last_login: lastLoginAt,
                is_active: true,
            },
            update: {
                last_login: lastLoginAt,
            },
        });
    }

    async findCredentialsByUserId(userId: number) {
        return this.prisma.user_credentials.findUnique({
            where: { user_id: userId },
            select: {
                user_id: true,
                refresh_token: true,
                token_expires: true,
                is_active: true,
            },
        });
    }

    async revokeCredentials(userId: number) {
        await this.prisma.user_credentials.update({
            where: { user_id: userId },
            data: {
                refresh_token: null,
                token_expires: null,
                is_active: false,
            },
        });
    }
}