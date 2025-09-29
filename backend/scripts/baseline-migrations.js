// Marks initial migrations as applied when schema already exists.
const knex = require('knex');
const config = require('../knexfile');

async function ensureBaseline() {
  const db = knex(config.development);
  try {
    const hasUsers = await db.schema.hasTable('users');
    // Ensure migrations tables exist
    const hasMigrations = await db.schema.hasTable('knex_migrations');
    if (!hasMigrations) {
      await db.schema.createTable('knex_migrations', (t) => {
        t.increments('id');
        t.string('name');
        t.integer('batch');
        t.timestamp('migration_time');
      });
    }
    const hasMigrationsLock = await db.schema.hasTable('knex_migrations_lock');
    if (!hasMigrationsLock) {
      await db.schema.createTable('knex_migrations_lock', (t) => {
        t.integer('is_locked');
      });
      await db('knex_migrations_lock').insert({ is_locked: 0 });
    }

    if (hasUsers) {
      const name = '20250821104037_create_all_tables.js';
      const exists = await db('knex_migrations').where({ name }).first().catch(() => null);
      if (!exists) {
        const [{ max }] = await db('knex_migrations').max('batch as max').catch(() => [{ max: 0 }]);
        await db('knex_migrations').insert({ name, batch: (max || 0) + 1, migration_time: db.fn.now() });
        console.log('Baseline applied for', name);
      }
    }

    // Check rides.status
    const hasStatus = await db.schema.hasColumn('rides', 'status');
    if (hasStatus) {
      const name = '20250903112447_add_status_to_rides_table.js';
      const exists = await db('knex_migrations').where({ name }).first().catch(() => null);
      if (!exists) {
        const [{ max }] = await db('knex_migrations').max('batch as max').catch(() => [{ max: 0 }]);
        await db('knex_migrations').insert({ name, batch: (max || 0) + 1, migration_time: db.fn.now() });
        console.log('Baseline applied for', name);
      }
    }
  } catch (e) {
    console.error('Baseline script failed:', e);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
}

ensureBaseline();

