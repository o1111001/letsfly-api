const { io } = global;
const disconnectService = require('../services/online_status/disconnected');

module.exports = socket => {
  const rooms = io.nsps['/api/v1/'].adapter.rooms;
  const { userId } = socket;
  if (
    !userId ||
    !rooms[userId] ||
    !rooms[userId].sockets ||
    !Object.keys(rooms[userId].sockets).length
  ) {
    disconnectService(userId);
  }
};
