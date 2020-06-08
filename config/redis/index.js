const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '../../.env') });

module.exports = {
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: parseInt(process.env.REDIS_PORT, 10),
};
