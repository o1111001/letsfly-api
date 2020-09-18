const { namespace } = require('../../namespaces');

const broadcastToRoom = (id, event, data) => {
  namespace.to(id).emit(event, data);
};

const broadcastToSetOfRooms = (set, event, data) => set.reduce(
  (acc, room) => acc.to(room),
  namespace,
).emit(event, data);


module.exports = {
  broadcastToRoom,
  broadcastToSetOfRooms,
};
