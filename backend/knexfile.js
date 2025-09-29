// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'Ade201778@1',
      database: 'izee_ride'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      loadExtensions: ['.ts', '.js']
    },
    seeds: {
      directory: './seeds'
    }
  },

  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      loadExtensions: ['.ts', '.js']
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      loadExtensions: ['.ts', '.js']
    },
    seeds: {
      directory: './seeds'
    }
  }

};
