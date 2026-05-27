# Dashboard Summary

The dashboard feature is split into a fast core summary endpoint and a slower insights endpoint.

## Endpoints

### `GET /dashboard/summary`

Returns the core dashboard payload for the current authenticated user.

Response sections:
- `overview`
- `recent_mood_entries`
- `weekly_mood_trend`

### `GET /dashboard/summary/insights`

Returns prediction and recommendation data for the current authenticated user.

Response sections:
- `mood_prediction`
- `recommendations`

## Notes

- Both endpoints require a Bearer access token in the `Authorization` header.
- The split keeps the initial dashboard load fast while allowing prediction data to arrive separately.
- The response contracts are defined in `src/features/v1/dashboard/summary/summary.dto.ts`.