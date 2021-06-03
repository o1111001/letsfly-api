const { namespace } = require('../namespaces');
const authorizedSocket = require('../policies/authorizedSocket');

const {
  connected,
  disconnected,
} = require('./connectStatuses');

namespace.use(authorizedSocket);
namespace.on('connection', socket => {
  socket.join(socket.userId, () => connected(socket));
  socket.on('disconnect', () => disconnected(socket));
});
