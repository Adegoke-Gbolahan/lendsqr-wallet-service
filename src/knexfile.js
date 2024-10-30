// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: 'lendsqr_wallet',
      user:     'root',
      password: ''
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'lendsqr_wallet',
      user:     'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'lendsqr_wallet',
      user:     'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    }
  }

};
