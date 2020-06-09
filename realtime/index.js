const { namespace } = require('../namespaces');
const authorizedSocket = require('../policies/authorizedSocket');

const privateMessage = require('./private_messages');
const connected = require('./connected');
const disconnected = require('./disconnected');

namespace.use(authorizedSocket);
namespace.on('connection', socket => {
  socket.join(socket.userId, () => connected(socket));
  socket.on('private_message', data => privateMessage(data, socket));
  socket.on('disconnect', () => disconnected(socket));
});
