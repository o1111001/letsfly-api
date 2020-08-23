const socketIO = require('socket.io');
const authorizedSocket = require('../../policies/authorizedSocket');
const redis = require('../redis');

module.exports = server => {
  const io = socketIO(server);
  io.adapter(redis);
  io.use(authorizedSocket);
  global.io = io;
};
