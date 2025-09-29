IZee Ride Monorepo (Backend + Mobile)

Overview

- Backend: Node.js + Express + TypeScript using Knex (PostgreSQL).
- Mobile: React Native (Expo) + TypeScript + NativeWind (TailwindCSS for RN).
- Database: PostgreSQL with migrations in `migrations/` and optional seeds in `seeds/`.

Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally or a DATABASE_URL
- pnpm/npm (your choice)

Backend Setup

- Copy env vars: `cp .env.example .env` and update values.
- Install deps: `npm install`
- Run DB migrations: `npm run migrate`
- (Optional) Seed data: `npm run seed`
- Start dev server: `npm run dev`

Database Notes

- Migrations include core entities and features:
  - `users`, `drivers`, `vehicles`, `rides`, `payments`
  - Rides `status` column
  - Wallets, cards, wallet transactions
  - Milepoints and transactions, tickets and claims
  - Support messages, user documents, community messages
- See files under `migrations/` for full definitions.

Mobile App (Expo + NativeWind)

- Location: `mobile/`
- Install deps: `cd mobile && npm install`
- Start Expo: `npm run start` (or `npm run android` / `npm run ios`)
- Tailwind/NativeWind:
  - Ensure `nativewind` is installed and `tailwind.config.js` includes:
    - `content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"]`
  - Ensure `babel.config.js` adds plugin: `['nativewind/babel']`

Configuring API URL in Mobile

- Recommended: add an `extra.apiUrl` to `mobile/app.json` and read via Expo Constants.
- Example `app.json` excerpt:
  - `"extra": { "apiUrl": "http://localhost:4000" }`
- Example usage in code:
  - Create `mobile/src/config/api.ts` that exports `API_URL` from Constants.

Running Migrations Safely

- Ensure `DATABASE_URL` in `.env` matches your Postgres instance.
- From repo root: `npm run migrate`
- Rollback last: `npm run migrate:rollback`
- Reset + seed: `npm run db:reset` (see package scripts)

Scripts

- Backend: `npm run dev`, `npm run migrate`, `npm run migrate:rollback`, `npm run seed`, `npm run db:reset`
- Mobile: inside `mobile/` — `npm run start`, `npm run android`, `npm run ios`, `npm run web`

Structure

- Backend source: `src/`
- Migrations: `migrations/`
- Seeds: `seeds/`
- Mobile app: `mobile/`

