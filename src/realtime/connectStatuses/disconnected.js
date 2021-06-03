const { io } = global;
const disconnectService = require('../../api/online_status/services/disconnected');

const { namespace } = require('../../namespaces');

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
    namespace.emit('offline', { event: 'offline', userId, lastOnline: Date.now() });
  }
};
