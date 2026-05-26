import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { getOpenApiSpec } from './spec';

export function createOpenApiRoutes() {
    const router = Router();
    const spec = getOpenApiSpec();

    router.use(
        '/',
        swaggerUi.serve,
        swaggerUi.setup(spec, {
            customCss: '.swagger-ui .topbar { display: none }',
        }),
    );

    router.get('/json', (_req, res) => {
        res.json(getOpenApiSpec());
    });

    return router;
}
