const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SALT_ROUNDS: process.env.SALT_ROUNDS && parseInt(process.env.SALT_ROUNDS, 10) || 7,
  EXPIRES: parseInt(process.env.EXPIRES, 10),
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
};
