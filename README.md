<p align="center">
  <h1 align="center">MoodSense</h1>
  <p align="center">
    <strong>Aplikasi Pemantauan Kesehatan Mental Berbasis Prediksi Mood dan Rekomendasi Intervensi Dini</strong>
  </p>
  <p align="center">
    <a href="#fitur-utama">Fitur</a> · <a href="#arsitektur">Arsitektur</a> · <a href="#quick-start">Quick Start</a> · <a href="#api-reference">API</a> · <a href="#testing">Testing</a>
  </p>
</p>

---

## Deskripsi

**MoodSense** adalah aplikasi full-stack untuk pemantauan kesehatan mental yang dirancang khusus bagi mahasiswa Indonesia. Aplikasi ini menggabungkan *daily mood check-in*, prediksi mood berbasis machine learning, dan rekomendasi intervensi dini yang dipersonalisasi untuk membantu pengguna mengenali pola emosional dan mengambil tindakan preventif sebelum kondisi mental memburuk.

Sistem ini terdiri dari tiga komponen utama:

| Komponen | Deskripsi |
|---|---|
| **Frontend** | Single-page application (React + Vite) dengan antarmuka responsif |
| **Backend** | REST API (Express + Prisma + JWT) dengan arsitektur vertical-slice |
| **ML API** | Microservice prediksi mood menggunakan late-fusion model (repository terpisah) |

## Fitur Utama

### Daily Mood Check-in

Proses check-in terbagi menjadi tiga langkah interaktif:

1. **Mood & Energy** : Pilih kondisi emosional (Very Happy, Happy, Normal, Stress, Very Stress)
2. **Factors & Activities** : Input jam tidur, level aktivitas fisik, jam belajar, dan skor sosial
3. **Notes** : Tambahkan catatan bebas sebagai konteks tambahan

### Prediksi Mood Berbasis ML

- Integrasi dengan ML API eksternal yang menggunakan arsitektur **late-fusion** untuk menggabungkan fitur numerik dan teks
- Prediksi mood ke dalam tiga kategori: **Happy**, **Normal**, atau **Stress**
- Skor confidence untuk setiap prediksi
- Rule-based fallback otomatis jika ML API tidak tersedia

### Dashboard Interaktif

- **Statistik ringkas**: check-in streak, rata-rata mood, kualitas tidur
- **Grafik tren mood** mingguan menggunakan Recharts
- **Insight AI**: analisis kontekstual berdasarkan data check-in terakhir
- **Prediction card**: hasil prediksi mood terbaru dengan confidence score
- **Todo list**: rekomendasi aktivitas dari AI yang dapat di-track

### Prediksi & Forecasting

- Proyeksi mood **5 hari ke depan** berdasarkan tren historis
- Analisis arah tren (meningkat / stabil / menurun)
- **Prevention tips**: saran pencegahan saat tren menurun
- **Boost tips**: saran untuk mempertahankan mood positif
- Visualisasi gabungan data historis dan proyeksi dalam satu grafik

### Rekomendasi Intervensi Dini

- Rekomendasi aktivitas yang dipersonalisasi berdasarkan kondisi mood
- Analisis faktor stressor dan booster
- Setiap rekomendasi mencakup nama, deskripsi, dan estimasi durasi
- Konten rekomendasi dalam Bahasa Indonesia

### Riwayat Check-in

- Histori lengkap semua check-in dengan detail prediksi
- Filter dan pencarian berdasarkan tanggal dan mood

### Pengaturan Pengguna

- Manajemen profil (nama, email, gender, tanggal lahir)
- Pengaturan tema (light/dark)
- Pengaturan pengingat check-in (aktif/nonaktif, waktu pengingat)
- Pengaturan bahasa (Indonesia/English)
- Ganti password

## Arsitektur

### Arsitektur Keseluruhan

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend   │────>│    Backend API   │────>│  ML API (Python) │
│  React+Vite  │<────│  Express+Prisma  │<────│  Late-Fusion     │
└─────────────┘     └────────┬────────┘     └──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   (Supabase /   │
                    │    Docker)      │
                    └─────────────────┘
```

### Arsitektur Backend (Vertical-Slice + Ports-and-Adapters)

```
backend/src/
├── features/v1/            # Vertical slices per fitur
│   ├── auth/               # register, login, logout, refresh, me
│   ├── dashboard/          # checkin, prediction, summary, todos
│   └── settings/           # get-settings, update-settings, update-profile, change-password
├── infrastructure/         # Implementasi konkret
│   ├── auth/               # ScryptPasswordHasher, JwtTokenService
│   ├── dashboard/          # PrismaSummaryRepository, PrismaCheckinRepository
│   ├── prediction/         # HttpPredictionService (integrasi ML API)
│   ├── security/           # Middleware autentikasi
│   └── settings/           # PrismaSettingsRepository
├── shared/
│   ├── ports/              # Interface abstrak (UserRepository, PredictionService, dll.)
│   ├── middleware/          # Express middleware
│   ├── openapi/            # Swagger/OpenAPI spec
│   └── utils/              # Utility functions
├── bootstrap/              # Dependency injection wiring
│   ├── create-app.ts       # Express app factory
│   ├── create-auth-module.ts
│   ├── create-dashboard-module.ts
│   └── create-settings-module.ts
├── app.ts                  # createApp() entry
└── server.ts               # Server bootstrap
```

**Prinsip utama:**

- **Use-cases** bergantung pada interface (`UserRepository`, `PasswordHasher`, `TokenService`, `PredictionService`), bukan class konkret
- **Controllers** bersifat thin: validasi DTO, panggil use-case, format response
- **Infrastructure** mengimplementasikan interface (`PrismaUserRepository`, `ScryptPasswordHasher`, `HttpPredictionService`)
- **Bootstrap** melakukan wiring dependency secara eksplisit di satu tempat

### Arsitektur Frontend

```
frontend/src/
├── pages/                  # Halaman utama
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── PredictionPage.jsx
│   ├── HistoryPage.jsx
│   ├── TodoListPage.jsx
│   ├── SettingsPage.jsx
│   └── tracker/            # Multi-step check-in flow
│       ├── MoodEnergyStep.jsx
│       ├── FactorsActivitiesStep.jsx
│       └── NoteStep.jsx
├── components/
│   ├── auth/               # AuthGuards (ProtectedRoute, PublicOnlyRoute)
│   ├── dashboard/          # StatCard, MoodChart, PredictionCard, RecommendationCard, dll.
│   ├── landing/            # HeroSection, FeaturesSection, Navbar, Footer
│   └── ui/                 # Komponen UI reusable
├── contexts/               # AuthContext, AppContext
├── layouts/                # DashboardLayout, TrackerLayout
├── lib/                    # API client functions (api.js, dashboard.js, checkin.js, todos.js)
├── routes/                 # AppRoutes.jsx
└── styles/                 # Styling tambahan
```

## Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19.x | UI library |
| Vite | 8.x | Build tool dan dev server |
| React Router | 7.x | Client-side routing |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Recharts | 3.x | Visualisasi grafik mood |
| Lucide React | 1.x | Icon library |

### Backend

| Teknologi | Versi | Kegunaan |
|---|---|---|
| Express | 5.x | HTTP framework |
| Prisma | 7.x | ORM dan database toolkit |
| TypeScript | 6.x | Type-safe development |
| Zod | 4.x | Runtime schema validation (DTO) |
| JSON Web Token | 9.x | Autentikasi access/refresh token |
| Swagger UI Express | 5.x | Dokumentasi API interaktif |

### Infrastructure

| Teknologi | Kegunaan |
|---|---|
| PostgreSQL 18 | Database utama |
| Docker / Docker Compose | Containerization |
| Node.js 22 | Runtime |
| pnpm | Package manager |

## Database Schema

Aplikasi menggunakan PostgreSQL dengan skema berikut:

| Tabel | Deskripsi |
|---|---|
| `users` | Data pengguna (email, nama, password, gender, tanggal lahir, role) |
| `user_credentials` | Refresh token, expiry, status aktif, last login |
| `user_settings` | Preferensi pengguna (tema, pengingat, bahasa) |
| `mood_logs` | Log check-in harian (tidur, aktivitas, belajar, sosial, perasaan, catatan) |
| `mood_predictions` | Hasil prediksi ML per check-in (mood result, confidence, activity suggestion) |
| `todo_items` | Rekomendasi aktivitas dari AI atau manual |
| `mood_forecasts` | Data forecasting mood per pengguna (JSON) |

### Enum Values

| Enum | Values |
|---|---|
| `Mood` | HAPPY, NORMAL, STRESS |
| `MoodExtended` | VERY_HAPPY, HAPPY, NORMAL, STRESS, VERY_STRESS |
| `ActivityLevel` | NONE, LOW, MODERATE, HIGH |
| `Gender` | MALE, FEMALE, OTHER |
| `Role` | USER, ADMIN |

## Quick Start

### Prasyarat

- **Node.js** >= 22
- **pnpm** (direkomendasikan) atau npm
- **Docker** dan **Docker Compose** (untuk database)
- **ML API** (opsional, tersedia fallback rule-based)

### Opsi A: Semua di Docker

```bash
cd backend
docker compose -f docker-compose.full.yml up -d
```

Backend berjalan di `http://localhost:5000`, database di `localhost:5432`.

### Opsi B: Database Docker + Backend Lokal

```bash
# 1. Jalankan PostgreSQL via Docker
cd backend
docker compose up -d

# 2. Setup environment
cp .env.example .env           # Edit sesuai kebutuhan

# 3. Install dependencies
pnpm install

# 4. Generate Prisma client dan jalankan migrasi
npx prisma generate
npx prisma migrate dev

# 5. Jalankan backend
pnpm dev                       # http://localhost:5000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev                       # http://localhost:5173
```

### ML API (Opsional)

ML API merupakan repository terpisah. Jika ML API tidak berjalan, backend akan otomatis menggunakan **rule-based fallback** untuk prediksi, insight, dan forecasting.

```bash
# Pastikan ML API berjalan di port 8000
# Konfigurasikan di backend/.env:
ML_API_URL=http://127.0.0.1:8000
```

## Environment Variables

Salin `backend/.env.example` ke `backend/.env` dan sesuaikan nilainya.

| Variable | Default | Deskripsi |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/moodsense` | Connection string PostgreSQL |
| `JWT_SECRET` | `change-me` | Secret key untuk signing JWT |
| `PORT` | `5000` | Port backend server |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | CORS allowed origins (comma-separated) |
| `ACCESS_TOKEN_EXPIRES` | `15m` | Masa berlaku access token |
| `REFRESH_TOKEN_EXPIRES` | `7d` | Masa berlaku refresh token |
| `ML_API_URL` | `http://127.0.0.1:8000` | URL endpoint ML API |

Frontend environment (`frontend/.env`):

| Variable | Default | Deskripsi |
|---|---|---|
| `VITE_API_URL` | (sesuai konfigurasi) | URL backend API |

## API Reference

Dokumentasi API interaktif tersedia melalui Swagger UI di:

```
http://localhost:5000/api-docs
```

### Endpoint Overview

#### Auth (`/auth`)

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registrasi pengguna baru | Tidak |
| `POST` | `/auth/login` | Login dengan email dan password | Tidak |
| `POST` | `/auth/refresh` | Refresh access token | Tidak |
| `POST` | `/auth/logout` | Logout dan revoke refresh token | Tidak |
| `GET` | `/auth/me` | Ambil data user yang sedang login | Ya |

#### Dashboard (`/dashboard`)

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Ringkasan dashboard (streak, rata-rata mood, tren mingguan) | Ya |
| `GET` | `/dashboard/summary/insights` | Insight prediksi dan rekomendasi | Ya |
| `POST` | `/dashboard/checkin` | Buat check-in harian (maks 1 per hari) | Ya |
| `GET` | `/dashboard/checkin/history` | Riwayat semua check-in dengan prediksi | Ya |
| `GET` | `/dashboard/forecast` | Proyeksi mood 5 hari ke depan | Ya |
| `GET` | `/dashboard/todos` | Ambil todo list rekomendasi | Ya |
| `PATCH` | `/dashboard/todos/:id/toggle` | Toggle status selesai todo | Ya |
| `DELETE` | `/dashboard/todos/:id` | Hapus todo | Ya |

#### Settings (`/settings`)

| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `GET` | `/settings` | Ambil pengaturan pengguna | Ya |
| `PATCH` | `/settings` | Update pengaturan (tema, pengingat, bahasa) | Ya |
| `PATCH` | `/settings/profile` | Update profil pengguna | Ya |
| `PATCH` | `/settings/password` | Ganti password | Ya |

### Contoh Request: Check-in

```bash
curl -X POST http://localhost:5000/dashboard/checkin \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sleep_hours": 7.5,
    "activity_level": "MODERATE",
    "study_hours": 4,
    "social_score": 6,
    "how_you_feeling": "HAPPY",
    "notes": "Hari ini cukup produktif"
  }'
```

### Integrasi ML API

Backend berkomunikasi dengan ML API melalui HTTP untuk empat endpoint:

| Endpoint ML | Fungsi | Fallback |
|---|---|---|
| `POST /api/v1/predict` | Prediksi mood (Happy/Normal/Stress) | Rule-based berdasarkan `how_you_feeling` |
| `POST /api/v1/insight` | Insight dan rekomendasi aktivitas | Template berdasarkan kondisi emosional |
| `POST /api/v1/factors` | Analisis faktor stressor dan booster | Rule-based berdasarkan metrik input |
| `POST /api/v1/forecast` | Proyeksi mood 5 hari | Proyeksi linear berdasarkan tren |

## Testing

Backend menggunakan **Vitest** sebagai test runner dengan strategi pengujian berlapis:

| Layer | Strategi | Contoh |
|---|---|---|
| **Use-cases** | In-memory repository + mock hasher/token service | `create-user.usecase.test.ts`, `login.usecase.test.ts` |
| **Controllers** | Unit test dengan mock use-case | `checkin.controller.test.ts`, `summary.controller.test.ts` |
| **DTOs** | Validasi Zod schema | `checkin.dto.test.ts`, `create-user.dto.test.ts` |
| **Infrastructure** | Integration test | `password-hasher.test.ts`, `token-service.test.ts` |
| **E2E** | End-to-end flow | `checkin.e2e.test.ts`, `auth.lifecycle.test.ts` |

```bash
# Jalankan semua test
cd backend
pnpm test

# Jalankan test dalam watch mode
pnpm test:watch
```

### Sebelum Commit

```bash
cd backend
pnpm test              # Pastikan semua test passed
npx tsc --noEmit       # Pastikan tidak ada type error
pnpm format            # Format kode
```

## Struktur Proyek

```
moodsense-app/
├── frontend/                # React SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── pages/           # Halaman aplikasi
│   │   ├── components/      # Komponen UI
│   │   ├── contexts/        # React contexts (auth, app)
│   │   ├── layouts/         # Layout templates
│   │   ├── lib/             # API client functions
│   │   ├── routes/          # Routing configuration
│   │   └── styles/          # Additional styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── features/v1/     # Vertical slices (auth, dashboard, settings)
│   │   ├── infrastructure/  # Concrete implementations
│   │   ├── shared/          # Ports, middleware, OpenAPI spec
│   │   ├── bootstrap/       # DI wiring
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── migrations/      # Migration files
│   │   └── seed-dami.ts     # Seed data
│   ├── tests/               # Unit, integration, dan E2E tests
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.full.yml
│   └── package.json
│
├── .prettierrc.json
├── LICENSE                  # MIT License
└── README.md
```

## Menambahkan Fitur Baru

1. **DTO** : Definisikan Zod schema di `src/features/v1/<feature>/<feature>.dto.ts`
2. **Use-case** : Implementasi di `<feature>.usecase.ts`, bergantung pada interface (bukan class konkret)
3. **Controller** : Parse DTO, panggil use-case, kembalikan response. Jaga agar tetap thin
4. **Route** : Buat Router di `<feature>.route.ts`
5. **Wire** : Daftarkan di bootstrap module yang sesuai (`create-auth-module.ts`, `create-dashboard-module.ts`, dll.)
6. **Test** : Tambahkan test di `tests/`, lalu jalankan `pnpm test`

## Deployment

### Docker (Production)

```bash
cd backend

# Build dan jalankan semua services
docker compose -f docker-compose.full.yml up -d --build
```

Dockerfile menggunakan **multi-stage build** untuk menghasilkan image yang optimal:

- **Stage 1 (build)**: Compile TypeScript, resolve path aliases
- **Stage 2 (runtime)**: Image minimal hanya dengan production dependencies dan compiled output

### Frontend Build

```bash
cd frontend
pnpm build              # Output ke dist/
pnpm preview             # Preview production build
```

## Tim

**MoodSenseTeam** | 2026

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
