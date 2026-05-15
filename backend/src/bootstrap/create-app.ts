import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { createPrismaClient } from '@/bootstrap/create-prisma-client';
import { createAuthModule } from '@/bootstrap/create-auth-module';

export function createApp() {
    const app = express();

    const corsOptions: cors.CorsOptions = {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };

    app.use(cors(corsOptions));
    app.use(express.json());

    const prisma = createPrismaClient();
    app.use('/auth', createAuthModule(prisma));

    app.get('/', (req: Request, res: Response) => {
        res.json({
            message: 'MoodSense API Running',
        });
    });

    return app;
}