# MoodSense App

MoodSense is a full-stack app with a React frontend and an Express backend.

## Project Structure

- `frontend/` - Vite + React app
- `backend/` - Express API

## Requirements

- Node.js installed
- npm installed

## Run the Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

### Environment

The backend expects configuration in a `.env` file located in the `backend/` folder. You can copy the example file `backend/.env.example` and adjust values as needed.

Example `.env` (in `backend/.env`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moodsense"
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173
```

If you use the included Docker Compose, start the database first from the `backend/` folder:

```bash
cd backend
docker compose up -d db
```

Then start the backend (this script preloads environment variables):

```bash
pnpm install
pnpm dev
```

For production, build and start with:

```bash
pnpm build
pnpm start
```

### Backend Start Script

```bash
npm start
```

## Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## API Status

The backend exposes a basic health check at:

```bash
GET /
```

Response:

```json
{
	"message": "MoodSense API Running"
}
```

## Build for Frontend Production

```bash
cd frontend
npm run build
```

## Notes

- Start the backend before using the frontend if the UI depends on the API.
- If needed, adjust the frontend API base URL to point to `http://localhost:5000`.

Files added for convenience:
- `backend/.env.example` — example environment variables for local development
