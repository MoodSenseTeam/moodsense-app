import type { PrismaClient } from '@/shared/db/generated/client/client';
import type { TodoRepository, TodoItem } from '@/shared/ports/todo.repository';

export class PrismaTodoRepository implements TodoRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async listByUser(userId: number): Promise<TodoItem[]> {
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
            // Remove todos that are no longer in the recommendation list
            await tx.todo_items.deleteMany({
                where: {
                    user_id: userId,
                    name: { notIn: incomingNames },
                },
            });

            // Upsert incoming items (insert new, keep existing)
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
                    },
                    update: {
                        description: item.description,
                        duration: item.duration,
                    },
                });
            }
        });
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
            },
        });

        return {
            ...updated,
            completed_at: updated.completed_at?.toISOString() ?? null,
            created_at: updated.created_at.toISOString(),
        };
    }
}
