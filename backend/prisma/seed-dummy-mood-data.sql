BEGIN;

-- Dummy dashboard data for user_id = 1
INSERT INTO mood_logs (
    log_id,
    user_id,
    sleep_hours,
    activity_level,
    study_hours,
    social_score,
    notes,
    sentiment_score,
    logged_at,
    created_at,
    updated_at
)
VALUES
    (
        1001,
        1,
        7.5,
        'MODERATE',
        2.5,
        7,
        'Started the week focused and calm.',
        0.78,
        '2026-05-20 08:15:00',
        '2026-05-20 08:15:00',
        '2026-05-20 08:15:00'
    ),
    (
        1002,
        1,
        6.0,
        'LOW',
        4.0,
        5,
        'A bit tired after class, but still okay.',
        0.42,
        '2026-05-21 08:20:00',
        '2026-05-21 08:20:00',
        '2026-05-21 08:20:00'
    ),
    (
        1003,
        1,
        8.2,
        'HIGH',
        3.0,
        8,
        'Good sleep and strong energy today.',
        0.91,
        '2026-05-22 08:10:00',
        '2026-05-22 08:10:00',
        '2026-05-22 08:10:00'
    ),
    (
        1004,
        1,
        5.8,
        'NONE',
        5.5,
        3,
        'Rough day, felt stressed and distracted.',
        -0.35,
        '2026-05-23 20:00:00',
        '2026-05-23 20:00:00',
        '2026-05-23 20:00:00'
    ),
    (
        1005,
        1,
        7.1,
        'MODERATE',
        2.0,
        6,
        'Recovered well after a restful night.',
        0.6,
        '2026-05-24 08:05:00',
        '2026-05-24 08:05:00',
        '2026-05-24 08:05:00'
    ),
    (
        1006,
        1,
        6.4,
        'LOW',
        4.8,
        4,
        'Busy schedule, needed more rest.',
        -0.12,
        '2026-05-25 19:30:00',
        '2026-05-25 19:30:00',
        '2026-05-25 19:30:00'
    ),
    (
        1007,
        1,
        7.9,
        'HIGH',
        2.2,
        9,
        'Ended the week on a strong note.',
        0.88,
        '2026-05-26 08:00:00',
        '2026-05-26 08:00:00',
        '2026-05-26 08:00:00'
    )
ON CONFLICT (log_id) DO NOTHING;

INSERT INTO mood_predictions (
    log_id,
    mood_result,
    activity_suggestion,
    confidence_score,
    created_at
)
VALUES
    (
        1001,
        'HAPPY',
        'Keep this routine. A short walk and hydration will help maintain your momentum.',
        0.84,
        '2026-05-20 08:16:00'
    ),
    (
        1002,
        'NORMAL',
        'Take a short break and keep your workload light tonight.',
        0.67,
        '2026-05-21 08:21:00'
    ),
    (
        1003,
        'HAPPY',
        'Use this energy for your hardest task first.',
        0.93,
        '2026-05-22 08:11:00'
    ),
    (
        1004,
        'STRESS',
        'Slow down, drink water, and disconnect from screens before bed.',
        0.9,
        '2026-05-23 20:01:00'
    ),
    (
        1005,
        'NORMAL',
        'Keep your pace steady and protect your sleep schedule.',
        0.73,
        '2026-05-24 08:06:00'
    ),
    (
        1006,
        'STRESS',
        'Take a 10-minute walk and avoid overloading your evening.',
        0.81,
        '2026-05-25 19:31:00'
    ),
    (
        1007,
        'HAPPY',
        'Great momentum. Keep up the balance and stay hydrated.',
        0.95,
        '2026-05-26 08:01:00'
    )
ON CONFLICT (log_id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('mood_logs', 'log_id'),
    GREATEST((SELECT COALESCE(MAX(log_id), 0) FROM mood_logs), 1007),
    true
);

SELECT setval(
    pg_get_serial_sequence('mood_predictions', 'prediction_id'),
    GREATEST((SELECT COALESCE(MAX(prediction_id), 0) FROM mood_predictions), 1007),
    true
);

COMMIT;