import express, {
    type Request,
    type Response,
    type NextFunction,
} from 'express';
import cors from 'cors';
import { createPrismaClient } from '@/bootstrap/create-prisma-client';
import { createAuthModule } from '@/bootstrap/create-auth-module';
import { createOpenApiRoutes } from '@/shared/openapi/openapi.route';
import { createDashboardModule } from '@/bootstrap/create-dashboard-module';
import { getConfig } from '@/shared/config';

export function createApp() {
    const app = express();
    const { allowedOrigins } = getConfig();

    const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use(cors(corsOptions));
    app.use(express.json());

    const prisma = createPrismaClient();
    app.use('/auth', createAuthModule(prisma));
    app.use('/dashboard', createDashboardModule(prisma));
    app.use('/api-docs', createOpenApiRoutes());

    app.get('/', (req: Request, res: Response) => {
        res.json({
            message: 'MoodSense API Running',
        });
    });

    app.use(
        (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
            console.error(err);

            if (err instanceof Error) {
                const prismaError = err as {
                    code?: string;
                    meta?: Record<string, unknown>;
                };
                res.status(500).json({
                    message: err.message,
                    ...(prismaError.code && { code: prismaError.code }),
                    ...(prismaError.meta && { meta: prismaError.meta }),
                });
                return;
            }

            res.status(500).json({ message: 'Internal server error' });
        },
    );

    return app;
}
