'use strict';

const knex = require('knex');

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = require('../env');

const config = {
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
};

const knexDB = knex({
  client: 'pg',
  connection: config,
  pool: { min: 2, max: 10 },
});

global.db = knexDB;
