const redis = require('redis');

const {
  REDIS_HOST,
  REDIS_PORT,
} = require('../env');

module.exports = redis({ host: REDIS_HOST, port: REDIS_PORT });


