const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = require('./config/env');

module.exports = {
  client: 'postgresql',
  connection: {
    database: DB_NAME,
    user:     DB_USER,
    password: DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
