
const Message = require('../../repositories');
const { CustomError } = require('../../../../helpers/errors');

module.exports = async (userId, { id, isPublic }) => {
  const message = await Message.get({ id });
  if (!message) throw new CustomError('Message not found', 404);
  if (message.senderId !== userId) throw new CustomError('Permission denied', 403);
  await Message.changePublicity({ id, isPublic });
};
