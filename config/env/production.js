// const { resolve } = require('path');
require('dotenv').config();

module.exports = {
  production: true,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PORT: process.env.DB_PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SALT_ROUNDS: process.env.SALT_ROUNDS && parseInt(process.env.SALT_ROUNDS, 10) || 7,
  EXPIRES_ACCESS: parseInt(process.env.EXPIRES_ACCESS, 10),
  EXPIRES_REFRESH: parseInt(process.env.EXPIRES_REFRESH, 10),
  JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
  BUCKET_NAME: process.env.BUCKET_NAME,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  // WFP
  MERCHANT_ACCOUNT: process.env.MERCHANT_ACCOUNT,
  MERCHANT_SECRET_KEY: process.env.MERCHANT_SECRET_KEY,
  MERCHANT_DOMAIN_NAME: process.env.MERCHANT_DOMAIN_NAME,

};
