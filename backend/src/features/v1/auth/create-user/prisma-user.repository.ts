import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { CreateUserDto } from './create-user.dto';
import type { UserRepository } from './user.repository';

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
}