// src/config/knex.ts
import knex from "knex";
import { env } from "./env";

const db = knex({
  client: "pg",
  connection: env.DATABASE_URL,
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
});

export default db;
