
const Message = require('../../../repositories/message');

module.exports = async (userId, messageId) => {
  const message = await Message.get({ id: messageId });
  if (!message) throw 'Message not found';
  if (message.senderId !== userId) throw 'Permission denied';
  await Message.deleteById({ id: messageId });
};
