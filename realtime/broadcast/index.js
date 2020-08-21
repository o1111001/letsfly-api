const { namespace } = require('../../namespaces');

const broadcastToRoom = (id, event, data) => {
  namespace.to(id).emit(event, data);
};

module.exports = {
  broadcastToRoom,
};
