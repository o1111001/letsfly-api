
const Message = require('../../../repositories/message');
const { CustomError } = require('../../../helpers/errors');

module.exports = async (userId, messageId) => {
  const message = await Message.get({ id: messageId });
  if (!message) throw new CustomError('Message not found', 404);
  if (message.senderId !== userId) throw new CustomError('Permission denied', 403);
  await Message.deleteById({ id: messageId });
};
