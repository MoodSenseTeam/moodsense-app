const spec = {
    openapi: '3.0.3',
    info: {
        title: 'MoodSense API',
        version: '1.0.0',
        description: 'Authentication and mood tracking API for the MoodSense application.',
    },
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
    ],
    paths: {
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                operationId: 'register',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password', 'gender', 'tanggal_lahir'],
                                properties: {
                                    name: { type: 'string', example: 'John Doe' },
                                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                                    password: { type: 'string', format: 'password', minLength: 8, example: 'password123' },
                                    gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'], example: 'OTHER' },
                                    tanggal_lahir: { type: 'string', format: 'date', example: '1990-01-01' },
                                    usage_reason: { type: 'string', example: 'Personal use' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'User created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'User created successfully' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user_id: { type: 'number', example: 1 },
                                                name: { type: 'string', example: 'John Doe' },
                                                email: { type: 'string', example: 'john@example.com' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error or email already in use',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Email already in use' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login with email and password',
                operationId: 'login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                                    password: { type: 'string', format: 'password', minLength: 8 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Login successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Login successful' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                accessToken: { type: 'string' },
                                                refreshToken: { type: 'string' },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        user_id: { type: 'number' },
                                                        name: { type: 'string' },
                                                        email: { type: 'string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Validation error or invalid credentials',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Invalid credentials.' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/refresh': {
            post: {
                tags: ['Auth'],
                summary: 'Refresh access token',
                operationId: 'refresh',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Token refreshed successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Token refreshed successfully' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                accessToken: { type: 'string' },
                                                refreshToken: { type: 'string' },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        user_id: { type: 'number' },
                                                        name: { type: 'string' },
                                                        email: { type: 'string' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid or expired refresh token',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Invalid refresh token.' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout and revoke refresh token',
                operationId: 'logout',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Logged out successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Logged out successfully' },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid refresh token',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Invalid refresh token.' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get current authenticated user',
                operationId: 'me',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Current user fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Current user fetched successfully' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user_id: { type: 'number', example: 1 },
                                                name: { type: 'string', example: 'John Doe' },
                                                email: { type: 'string', example: 'john@example.com' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Missing or invalid access token',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Missing access token' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Provide your access token as a Bearer token in the Authorization header.',
            },
        },
    },
} as const;

export function getOpenApiSpec() {
    const port = process.env.PORT ?? '5000';
    return {
        ...spec,
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local development',
            },
        ],
    };
}
