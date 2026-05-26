import type { PrismaClient } from '@/shared/db/generated/client/client';

import { Router } from 'express';
import { PrismaUserRepository } from '@/infrastructure/auth/prisma-user.repository';
import { CreateUserUseCase } from '@/features/v1/auth/create-user/create-user.usecase';
import { CreateUserController } from '@/features/v1/auth/create-user/create-user.controller';
import { createUserRoutes } from '@/features/v1/auth/create-user/create-user.route';
import { ScryptPasswordHasher } from '@/infrastructure/security/password-hasher';
import { LoginUseCase } from '@/features/v1/auth/login/login.usecase';
import { LoginController } from '@/features/v1/auth/login/login.controller';
import { createLoginRoutes } from '@/features/v1/auth/login/login.route';
import { JwtTokenService } from '@/infrastructure/security/token-service';
import { RefreshUseCase } from '@/features/v1/auth/refresh/refresh.usecase';
import { RefreshController } from '@/features/v1/auth/refresh/refresh.controller';
import { createRefreshRoutes } from '@/features/v1/auth/refresh/refresh.route';
import { LogoutUseCase } from '@/features/v1/auth/logout/logout.usecase';
import { LogoutController } from '@/features/v1/auth/logout/logout.controller';
import { createLogoutRoutes } from '@/features/v1/auth/logout/logout.route';
import { MeController } from '@/features/v1/auth/me/me.controller';
import { createMeRoutes } from '@/features/v1/auth/me/me.route';

export function createAuthModule(prisma: PrismaClient) {
    const router = Router();

    const userRepository = new PrismaUserRepository(prisma);
    const passwordHasher = new ScryptPasswordHasher();

    // Create user (register)
    const createUserUseCase = new CreateUserUseCase(
        userRepository,
        passwordHasher,
    );
    const createUserController = new CreateUserController(createUserUseCase);
    router.use(createUserRoutes(createUserController));

    // Login
    const tokenService = new JwtTokenService();
    const loginUseCase = new LoginUseCase(
        userRepository,
        passwordHasher,
        tokenService,
    );
    const loginController = new LoginController(loginUseCase);
    router.use(createLoginRoutes(loginController));

    const refreshUseCase = new RefreshUseCase(userRepository, tokenService);
    const refreshController = new RefreshController(refreshUseCase);
    router.use(createRefreshRoutes(refreshController));

    const logoutUseCase = new LogoutUseCase(userRepository, tokenService);
    const logoutController = new LogoutController(logoutUseCase);
    router.use(createLogoutRoutes(logoutController));

    const meController = new MeController(userRepository, tokenService);
    router.use(createMeRoutes(meController));

    return router;
}
