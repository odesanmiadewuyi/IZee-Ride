# IZee-Ride — Monorepo (Backend + Mobile)

A working repository for the IZee-Ride platform containing:

- backend — Node.js/Express API with Knex migrations (PostgreSQL)
- mobile/IZee-Ride — Expo React Native app (primary mobile app)
- mobile/IZee-Ride/frontend — Classic React Native app (secondary)

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 13+ running locally (or a DATABASE_URL to a server)
- Expo CLI (installed on demand by `npm run start`), Android Studio/Xcode if you run emulators/simulators

## Quick Start

### 1) Backend API

Path: `backend`

1. Copy env and update values:
   - `cp backend/.env.example backend/.env` (Windows PowerShell: `Copy-Item backend/.env.example backend/.env`)
   - Set at least:
     - `PORT` — API port (recommend 5000 to match defaults in sample requests)
     - `JWT_SECRET` — any strong random string
     - `DATABASE_URL` — e.g. `postgresql://postgres:password@localhost:5432/izee_ride`
2. Install dependencies:
   - `cd backend && npm install`
3. Create database (if it doesn’t exist):
   - `createdb izee_ride` (or create via PgAdmin/GUI)
4. Run migrations and seeds:
   - `npm run migrate`
   - optionally `npm run seed`
5. Start the server (hot reload):
   - `npm run dev`

Notes
- Server entry: `backend/src/server.ts` (listens on `PORT`).
- Knex config: `backend/knexfile.js`.
- Requests: `backend/docs/sample-requests.http` (use VS Code REST Client or copy endpoints into Postman/cURL).
- Integration guide: `backend/docs/INTEGRATION_GUIDE.md`.

### 2) Mobile App (Expo)

Primary app path: `mobile/IZee-Ride`

1. Install dependencies:
   - `cd mobile/IZee-Ride && npm install`
2. Point the app at your API:
   - The client reads `EXPO_PUBLIC_API_URL` (see `mobile/IZee-Ride/frontend/src/api/client.ts`).
   - For local backend on port 5000, set before starting:
     - PowerShell: `$env:EXPO_PUBLIC_API_URL = 'http://10.0.2.2:5000/api'` (Android emulator)
     - iOS simulator: `$env:EXPO_PUBLIC_API_URL = 'http://localhost:5000/api'`
     - Physical device: use your machine IP, e.g. `$env:EXPO_PUBLIC_API_URL = 'http://192.168.1.20:5000/api'`
3. Start Expo:
   - `npm run start`
   - Then press `a` for Android, `i` for iOS, or scan the QR code in Expo Go.

### 3) Classic React Native App (optional)

Secondary app path: `mobile/IZee-Ride/frontend`

- This project consumes the Expo package via `file:..` and uses React Native CLI workflows.
- Typical flow:
  - `cd mobile/IZee-Ride/frontend`
  - `npm install`
  - Set API base (same `EXPO_PUBLIC_API_URL` convention or adjust `client.ts`)
  - Android: `npm run android`
  - Start Metro: `npm start`

## Repository Conventions

- Do not commit secrets. Keep real values in `backend/.env`.
- `.gitignore` excludes build outputs (`bin/`, `obj/`, `*.dll`, `*.pdb`, `*.exe`) and local DB files (`*.sqlite*`).
- If you add migrations or seeds, keep them in `backend/migrations` and `backend/seeds`.

## Troubleshooting

- Backend folder not expanding on GitHub: fixed by removing nested git repos (submodules) and committing actual files.
- Cannot connect to DB: verify `DATABASE_URL` and that Postgres is running. URL-encode any special characters in the password.
- Port mismatch: sample requests use 5000. Set `PORT=5000` in `backend/.env`, or update your REST client to match your chosen port.
- Mobile cannot reach backend:
  - Android emulator uses `10.0.2.2` instead of `localhost`.
  - Ensure your machine’s firewall allows inbound connections to the selected port when using a physical device.

---

Enjoy hacking on IZee-Ride! If you want, we can add GitHub Actions for CI (lint, typecheck, migrations) next.
