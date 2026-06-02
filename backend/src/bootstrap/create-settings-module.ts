import type { PrismaClient } from '@/shared/db/generated/client/client';

import { Router } from 'express';
import { JwtTokenService } from '@/infrastructure/security/token-service';
import { ScryptPasswordHasher } from '@/infrastructure/security/password-hasher';
import { requireAccessToken } from '@/shared/middleware/require-access-token';
import { PrismaSettingsRepository } from '@/infrastructure/settings/prisma-settings.repository';
import { PrismaUserRepository } from '@/infrastructure/auth/prisma-user.repository';
import { GetSettingsUseCase } from '@/features/v1/settings/get-settings/get-settings.usecase';
import { GetSettingsController } from '@/features/v1/settings/get-settings/get-settings.controller';
import { createGetSettingsRoutes } from '@/features/v1/settings/get-settings/get-settings.route';
import { UpdateSettingsUseCase } from '@/features/v1/settings/update-settings/update-settings.usecase';
import { UpdateSettingsController } from '@/features/v1/settings/update-settings/update-settings.controller';
import { createUpdateSettingsRoutes } from '@/features/v1/settings/update-settings/update-settings.route';
import { UpdateProfileUseCase } from '@/features/v1/settings/update-profile/update-profile.usecase';
import { UpdateProfileController } from '@/features/v1/settings/update-profile/update-profile.controller';
import { createUpdateProfileRoutes } from '@/features/v1/settings/update-profile/update-profile.route';
import { ChangePasswordUseCase } from '@/features/v1/settings/change-password/change-password.usecase';
import { ChangePasswordController } from '@/features/v1/settings/change-password/change-password.controller';
import { createChangePasswordRoutes } from '@/features/v1/settings/change-password/change-password.route';

export function createSettingsModule(prisma: PrismaClient): Router {
    const router = Router();
    const tokenService = new JwtTokenService();

    router.use(requireAccessToken(tokenService));

    const settingsRepository = new PrismaSettingsRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);
    const passwordHasher = new ScryptPasswordHasher();

    // Get settings
    const getSettingsUseCase = new GetSettingsUseCase(settingsRepository);
    const getSettingsController = new GetSettingsController(getSettingsUseCase);
    router.use(createGetSettingsRoutes(getSettingsController));

    // Update settings (preferences)
    const updateSettingsUseCase = new UpdateSettingsUseCase(settingsRepository);
    const updateSettingsController = new UpdateSettingsController(
        updateSettingsUseCase,
    );
    router.use(createUpdateSettingsRoutes(updateSettingsController));

    // Update profile
    const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
    const updateProfileController = new UpdateProfileController(
        updateProfileUseCase,
    );
    router.use(createUpdateProfileRoutes(updateProfileController));

    // Change password
    const changePasswordUseCase = new ChangePasswordUseCase(
        userRepository,
        passwordHasher,
    );
    const changePasswordController = new ChangePasswordController(
        changePasswordUseCase,
    );
    router.use(createChangePasswordRoutes(changePasswordController));

    return router;
}
