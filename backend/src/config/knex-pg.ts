// src/config/knex-pg.ts - PostgreSQL configuration
import knex from "knex";
import { env } from "./env";

const db = knex({
  client: "pg",
  connection: env.DATABASE_URL || {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Ade201778@1',
    database: 'izee_ride'
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
});

export default db;
