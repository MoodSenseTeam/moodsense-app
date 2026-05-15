import type { PrismaClient } from '../shared/db/generated/client/client';

import { PrismaUserRepository } from '../features/v1/auth/create-user/prisma-user.repository';
import { CreateUserUseCase } from '../features/v1/auth/create-user/create-user.usecase';
import { CreateUserController } from '../features/v1/auth/create-user/create-user.controller';
import { createUserRoutes } from '../features/v1/auth/create-user/create-user.route';
import { ScryptPasswordHasher } from '../infrastructure/security/password-hasher';

export function createAuthModule(prisma: PrismaClient) {
    const userRepository = new PrismaUserRepository(prisma);
    const passwordHasher = new ScryptPasswordHasher();
    const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
    const createUserController = new CreateUserController(createUserUseCase);

    return createUserRoutes(createUserController);
}