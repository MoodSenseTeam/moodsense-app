import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { TodoRepository, TodoItem } from '@/shared/ports/todo.repository';

export class PrismaTodoRepository implements TodoRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async listByUser(userId: number): Promise<TodoItem[]> {
        // Daily reset: uncheck todos completed before today
        const today = new Date().toISOString().slice(0, 10);
        await this.prisma.todo_items.updateMany({
            where: {
                user_id: userId,
                is_completed: true,
                completed_at: { lt: new Date(`${today}T00:00:00.000Z`) },
            },
            data: { is_completed: false, completed_at: null },
        });

        const rows = await this.prisma.todo_items.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'asc' },
            select: {
                todo_id: true,
                user_id: true,
                name: true,
                description: true,
                duration: true,
                is_completed: true,
                completed_at: true,
                created_at: true,
                source: true,
            },
        });

        return rows.map((row) => ({
            ...row,
            completed_at: row.completed_at?.toISOString() ?? null,
            created_at: row.created_at.toISOString(),
        }));
    }

    async upsert(
        userId: number,
        items: Array<{ name: string; description: string; duration: string }>,
    ): Promise<void> {
        const incomingNames = items.map((item) => item.name);

        await this.prisma.$transaction(async (tx) => {
            // Only remove AI-generated todos that are no longer recommended
            await tx.todo_items.deleteMany({
                where: {
                    user_id: userId,
                    source: 'AI',
                    name: { notIn: incomingNames },
                },
            });

            // Upsert incoming items (insert new, update existing — only AI source)
            for (const item of items) {
                await tx.todo_items.upsert({
                    where: {
                        user_id_name: {
                            user_id: userId,
                            name: item.name,
                        },
                    },
                    create: {
                        user_id: userId,
                        name: item.name,
                        description: item.description,
                        duration: item.duration,
                        source: 'AI',
                    },
                    update: {
                        description: item.description,
                        duration: item.duration,
                        // Don't change source — keep MANUAL if user edited it
                    },
                });
            }
        });
    }

    async create(
        userId: number,
        data: { name: string; description: string; duration: string },
    ): Promise<TodoItem> {
        const created = await this.prisma.todo_items.create({
            data: {
                user_id: userId,
                name: data.name,
                description: data.description,
                duration: data.duration,
                source: 'MANUAL',
            },
            select: {
                todo_id: true,
                user_id: true,
                name: true,
                description: true,
                duration: true,
                is_completed: true,
                completed_at: true,
                created_at: true,
                source: true,
            },
        });

        return {
            ...created,
            completed_at: created.completed_at?.toISOString() ?? null,
            created_at: created.created_at.toISOString(),
        };
    }

    async toggle(todoId: number, userId: number): Promise<TodoItem> {
        const existing = await this.prisma.todo_items.findFirst({
            where: { todo_id: todoId, user_id: userId },
            select: { is_completed: true, completed_at: true },
        });

        if (!existing) {
            throw new Error('Todo item not found');
        }

        const newCompleted = !existing.is_completed;

        const updated = await this.prisma.todo_items.update({
            where: { todo_id: todoId },
            data: {
                is_completed: newCompleted,
                completed_at: newCompleted ? new Date() : null,
            },
            select: {
                todo_id: true,
                user_id: true,
                name: true,
                description: true,
                duration: true,
                is_completed: true,
                completed_at: true,
                created_at: true,
                source: true,
            },
        });

        return {
            ...updated,
            completed_at: updated.completed_at?.toISOString() ?? null,
            created_at: updated.created_at.toISOString(),
        };
    }

    async delete(todoId: number, userId: number): Promise<void> {
        const existing = await this.prisma.todo_items.findFirst({
            where: { todo_id: todoId, user_id: userId },
            select: { todo_id: true },
        });

        if (!existing) {
            throw new Error('Todo item not found');
        }

        await this.prisma.todo_items.delete({
            where: { todo_id: todoId },
        });
    }
}
