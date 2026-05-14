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
