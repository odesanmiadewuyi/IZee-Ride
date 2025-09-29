Integration Guide (Backend + Mobile)

1) Backend

- Env: copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- Install dependencies: `npm install`
- Run migrations: `npm run migrate`
- Optional seeds: `npm run seed`
- Start server: `npm run dev`

2) Database Schema (key migrations)

- migrations/20250821104037_create_all_tables.js
  - users, drivers, vehicles, rides, payments
- migrations/20250903112447_add_status_to_rides_table.js
  - adds rides.status
- migrations/20250908120000_create_wallets_and_rewards.js
  - wallets, wallet_transactions, cards, milepoints, milepoint_transactions, tickets, ticket_claims; extends payments
- migrations/20250908123000_support_docs_community.js
  - support_messages, documents, community_messages

3) Mobile (Expo + NativeWind)

- Path: `mobile/`
- Install deps: `cd mobile && npm install`
- NativeWind/Tailwind
  - `babel.config.js` includes `['nativewind/babel']`
  - `tailwind.config.js` content includes `./App.{js,jsx,ts,tsx}` and `./src/**/*.{js,jsx,ts,tsx}`
  - Use `className` on RN components
- API URL configuration
  - Add to `mobile/app.json`:
    - `"extra": { "apiUrl": "http://localhost:4000" }`
  - In code, read from Expo Constants and export `API_URL`.

4) Running Everything

- Start backend: `npm run dev` (default on port 4000)
- Start mobile: `cd mobile && npm run start`
- Update `apiUrl` if running on a device or emulator

5) Troubleshooting

- Ensure Postgres is running and `DATABASE_URL` is correct.
- If password contains special characters, URL-encode them.
- Use `npm run migrate:rollback` to revert last migration.
- Use `npm run db:reset` to rollback, migrate, and seed.

