'use strict';

const knex = require('knex');

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = require('../env');

const config = {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
};

console.log('congig', config, `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);

const knexDB = knex({
  client: 'pg',
  connection: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,

  // connection: ``,
  pool: { min: 2, max: 10 },
});

global.db = knexDB;
