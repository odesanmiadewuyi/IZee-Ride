// PostgreSQL configuration for IZee-Ride

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
      password: 'password',
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
