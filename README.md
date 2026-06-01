# MoodSense App

Full-stack app — React frontend, Express backend.

## Quick start

### Option A — everything in Docker

```bash
cd backend
docker compose -f docker-compose.full.yml up -d
```

Backend runs on `http://localhost:5000`, database on `localhost:5432`.

### Option B — Docker database, local backend

```bash
cd backend
docker compose up -d              # starts PostgreSQL only
cp .env.example .env              # edit if needed
pnpm install
pnpm dev                          # http://localhost:5000
```

### Frontend (either option)

```bash
cd frontend
pnpm install
pnpm dev                          # http://localhost:5173
```

## Environment

Copy `backend/.env.example` to `backend/.env` and adjust values. The full Docker Compose sets these automatically.

| Variable | Default |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/moodsense` |
| `PORT` | `5000` |
| `ALLOWED_ORIGINS` | `http://localhost:5173` |
| `JWT_SECRET` | `change-me` |
| `ACCESS_TOKEN_EXPIRES` | `15m` |
| `REFRESH_TOKEN_EXPIRES` | `7d` |

## Project structure

| Directory | Stack |
|---|---|
| `frontend/` | Vite + React |
| `backend/` | Express + Prisma + JWT |

## Testing

```bash
cd backend
pnpm test
```
