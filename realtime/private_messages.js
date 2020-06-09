const { namespace } = require('../namespaces');
const { createMessage } = require('../services/private_messages');
const { io } = global;
module.exports = async (data, socket) => {
  try {
    const { receiverId, text, type, attachment } = data;
    const { userId } = socket;
    if (
      !receiverId ||
      !type ||
      (type === 'audio' && (text || !attachment)) ||
      (type === 'text' && !text) ||
      !['audio', 'text'].includes(type)
    ) {
      throw 'Wrong parameters';
    }

    const message = await createMessage(userId, receiverId, text, type, attachment);
    namespace.to(userId).emit('private_message', message);
    namespace.to(receiverId).emit('private_message', message);
    // console.log(io.nsps['/api/v1/'].adapter.rooms);
  } catch (error) {
    console.error('error', error);
    socket.emit('user_error', error);
  }
};
