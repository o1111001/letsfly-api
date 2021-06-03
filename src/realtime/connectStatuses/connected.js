// const connectedService = require('../../services/online_status/connected');
const connectedService = require('../../api/online_status/services/connected');

const { namespace } = require('../../namespaces');

module.exports = socket => {
  const { userId } = socket;
  namespace.emit('online', { event: 'online', userId });

  connectedService(userId);
  console.log(`${socket.userId} connected!`);
};
