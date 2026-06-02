import { getConfig } from '@/shared/config';

const spec = {
    openapi: '3.0.3',
    info: {
        title: 'MoodSense API',
        version: '1.0.0',
        description:
            'Authentication and mood tracking API for the MoodSense application.',
    },
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        {
            name: 'Dashboard',
            description: 'Dashboard summary and check-in endpoints',
        },
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
                                required: [
                                    'name',
                                    'email',
                                    'password',
                                    'gender',
                                    'tanggal_lahir',
                                ],
                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'John Doe',
                                    },
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'john@example.com',
                                    },
                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        minLength: 8,
                                        example: 'password123',
                                    },
                                    gender: {
                                        type: 'string',
                                        enum: ['MALE', 'FEMALE', 'OTHER'],
                                        example: 'OTHER',
                                    },
                                    tanggal_lahir: {
                                        type: 'string',
                                        format: 'date',
                                        example: '1990-01-01',
                                    },
                                    usage_reason: {
                                        type: 'string',
                                        example: 'Personal use',
                                    },
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
                                        message: {
                                            type: 'string',
                                            example:
                                                'User created successfully',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user_id: {
                                                    type: 'number',
                                                    example: 1,
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'John Doe',
                                                },
                                                email: {
                                                    type: 'string',
                                                    example: 'john@example.com',
                                                },
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
                                        message: {
                                            type: 'string',
                                            example: 'Email already in use',
                                        },
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
                                    email: {
                                        type: 'string',
                                        format: 'email',
                                        example: 'john@example.com',
                                    },
                                    password: {
                                        type: 'string',
                                        format: 'password',
                                        minLength: 8,
                                    },
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
                                        message: {
                                            type: 'string',
                                            example: 'Login successful',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                accessToken: { type: 'string' },
                                                refreshToken: {
                                                    type: 'string',
                                                },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        user_id: {
                                                            type: 'number',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                        },
                                                        email: {
                                                            type: 'string',
                                                        },
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
                                        message: {
                                            type: 'string',
                                            example: 'Invalid credentials.',
                                        },
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
                                        message: {
                                            type: 'string',
                                            example:
                                                'Token refreshed successfully',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                accessToken: { type: 'string' },
                                                refreshToken: {
                                                    type: 'string',
                                                },
                                                user: {
                                                    type: 'object',
                                                    properties: {
                                                        user_id: {
                                                            type: 'number',
                                                        },
                                                        name: {
                                                            type: 'string',
                                                        },
                                                        email: {
                                                            type: 'string',
                                                        },
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
                                        message: {
                                            type: 'string',
                                            example: 'Invalid refresh token.',
                                        },
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
                                        message: {
                                            type: 'string',
                                            example: 'Logged out successfully',
                                        },
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
                                        message: {
                                            type: 'string',
                                            example: 'Invalid refresh token.',
                                        },
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
                                        message: {
                                            type: 'string',
                                            example:
                                                'Current user fetched successfully',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                user_id: {
                                                    type: 'number',
                                                    example: 1,
                                                },
                                                name: {
                                                    type: 'string',
                                                    example: 'John Doe',
                                                },
                                                email: {
                                                    type: 'string',
                                                    example: 'john@example.com',
                                                },
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
                                        message: {
                                            type: 'string',
                                            example: 'Missing access token',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/summary': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get the dashboard summary',
                operationId: 'getDashboardSummary',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Dashboard summary fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        overview: {
                                            type: 'object',
                                            properties: {
                                                check_in_streak: {
                                                    type: 'number',
                                                    example: 5,
                                                },
                                                average_mood: {
                                                    type: 'number',
                                                    example: 6.4,
                                                },
                                                sleep_quality: {
                                                    type: 'number',
                                                    example: 7.8,
                                                },
                                            },
                                        },
                                        recent_mood_entries: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    mood_value: {
                                                        type: 'number',
                                                        example: 6,
                                                    },
                                                    created_at: {
                                                        type: 'string',
                                                        format: 'date-time',
                                                    },
                                                    notes: {
                                                        type: 'string',
                                                        nullable: true,
                                                    },
                                                },
                                            },
                                        },
                                        weekly_mood_trend: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    date: {
                                                        type: 'string',
                                                        example: '2026-05-27',
                                                    },
                                                    average_mood: {
                                                        type: 'number',
                                                        example: 6.1,
                                                    },
                                                },
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
                                        message: {
                                            type: 'string',
                                            example: 'Unauthorized',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/summary/insights': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get dashboard insights',
                operationId: 'getDashboardInsights',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Dashboard insights fetched successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mood_prediction: {
                                            oneOf: [
                                                {
                                                    type: 'object',
                                                    properties: {
                                                        predicted_mood: {
                                                            type: 'number',
                                                            example: 6,
                                                        },
                                                        confidence_score: {
                                                            type: 'number',
                                                            example: 0.88,
                                                        },
                                                    },
                                                },
                                                { type: 'null' },
                                            ],
                                        },
                                        recommendations: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            example: [
                                                'Take a short walk',
                                                'Drink water',
                                            ],
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
                                        message: {
                                            type: 'string',
                                            example: 'Unauthorized',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/checkin': {
            post: {
                tags: ['Dashboard'],
                summary: 'Create a daily mood check-in',
                description:
                    'Submit a daily mood check-in with sleep, activity, study, and social data. Only one check-in per day is allowed.',
                operationId: 'createCheckin',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: [
                                    'sleep_hours',
                                    'activity_level',
                                    'study_hours',
                                    'social_score',
                                ],
                                properties: {
                                    sleep_hours: {
                                        type: 'number',
                                        minimum: 0,
                                        maximum: 24,
                                        example: 7.5,
                                        description:
                                            'Hours of sleep (0–24)',
                                    },
                                    activity_level: {
                                        type: 'string',
                                        enum: [
                                            'NONE',
                                            'LOW',
                                            'MODERATE',
                                            'HIGH',
                                        ],
                                        example: 'MODERATE',
                                        description:
                                            'Physical activity level for the day',
                                    },
                                    study_hours: {
                                        type: 'number',
                                        minimum: 0,
                                        maximum: 24,
                                        example: 4,
                                        description:
                                            'Hours spent studying (0–24)',
                                    },
                                    social_score: {
                                        type: 'integer',
                                        minimum: 1,
                                        maximum: 10,
                                        example: 6,
                                        description:
                                            'Self-rated social interaction score (1–10)',
                                    },
                                    notes: {
                                        type: 'string',
                                        maxLength: 500,
                                        example: 'Felt great after a morning run',
                                        description:
                                            'Optional free-text notes (max 500 chars)',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Check-in created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example:
                                                'Check-in created successfully',
                                        },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                log_id: {
                                                    type: 'number',
                                                    example: 1,
                                                },
                                                user_id: {
                                                    type: 'number',
                                                    example: 15,
                                                },
                                                sleep_hours: {
                                                    type: 'number',
                                                    example: 7.5,
                                                },
                                                activity_level: {
                                                    type: 'string',
                                                    example: 'MODERATE',
                                                },
                                                study_hours: {
                                                    type: 'number',
                                                    example: 4,
                                                },
                                                social_score: {
                                                    type: 'integer',
                                                    example: 6,
                                                },
                                                notes: {
                                                    type: 'string',
                                                    nullable: true,
                                                    example:
                                                        'Felt great after a morning run',
                                                },
                                                logged_at: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                },
                                                created_at: {
                                                    type: 'string',
                                                    format: 'date-time',
                                                },
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
                                        message: {
                                            type: 'string',
                                            example: 'Unauthorized',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '409': {
                        description: 'Already checked in today',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example:
                                                'You have already checked in today',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/dashboard/checkin/history': {
            get: {
                tags: ['Dashboard'],
                summary: 'Get all daily mood check-in logs history',
                description:
                    'Retrieve the history of all daily mood check-ins for the authenticated user, ordered from newest to oldest. Includes predictions and localized Indonesian recommendations.',
                operationId: 'getCheckinHistory',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Check-in log history retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example:
                                                'Check-in log history retrieved successfully',
                                        },
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    log_id: { type: 'number', example: 2 },
                                                    user_id: { type: 'number', example: 15 },
                                                    sleep_hours: { type: 'number', example: 8.0 },
                                                    activity_level: { type: 'string', example: 'HIGH' },
                                                    study_hours: { type: 'number', example: 6.0 },
                                                    social_score: { type: 'integer', example: 8 },
                                                    how_you_feeling: { type: 'string', example: 'HAPPY' },
                                                    notes: { type: 'string', nullable: true, example: 'Had a wonderful day' },
                                                    logged_at: { type: 'string', format: 'date-time' },
                                                    created_at: { type: 'string', format: 'date-time' },
                                                    prediction: {
                                                        type: 'object',
                                                        properties: {
                                                            mood_result: { type: 'string', example: 'HAPPY' },
                                                            confidence_score: { type: 'number', example: 0.95 },
                                                            activity_suggestion: { type: 'string', example: 'Luar biasa! Salurkan energi positifmu...' },
                                                        },
                                                    },
                                                },
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
                                        message: {
                                            type: 'string',
                                            example: 'Unauthorized',
                                        },
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
                description:
                    'Provide your access token as a Bearer token in the Authorization header.',
            },
        },
    },
} as const;

export function getOpenApiSpec() {
    const { port } = getConfig();
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
