// src/config/env.ts

import dotenv from 'dotenv';
dotenv.config();

// Export environment variables
export const env = {
    PORT: process.env.PORT || 4000,
    JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
    // Leave empty by default so knex-pg falls back to object config.
    // If you set this in .env, ensure password is URL-encoded.
    DATABASE_URL: process.env.DATABASE_URL || ""
  };
