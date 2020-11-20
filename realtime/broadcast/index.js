const { namespace } = require('../../namespaces');

const broadcastToRoom = (id, event, data) => {
  namespace.to(id).emit(event, { ...data, event });
};

const broadcastToSetOfRooms = (set, event, data) => set.reduce(
  (acc, room) => acc.to(room),
  namespace,
).emit(event, { ...data, event });


module.exports = {
  broadcastToRoom,
  broadcastToSetOfRooms,
};
