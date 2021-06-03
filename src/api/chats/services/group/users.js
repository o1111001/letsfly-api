const Chat = require('../../repositories');
const { CustomError } = require('../../../../helpers/errors');
const isMember = ({ userId, chatId }) => Chat.isMember({ userId, chatId });

const getChat = async (link, userId) => {
  const chat = await Chat.getFull(link, userId || -1);
  if (!chat) return {};
  const { messages, hasMore } = await Chat.getMessages({ userId, chatId: chat.id }, {});
  chat.messages = messages;
  chat.hasMore = hasMore;
  chat.files = await Chat.getInitFiles(chat.type, { chatId: chat.id, userId });
  return chat;
};

const subscribeChat = (chatId, userId) => Chat.subcribe(chatId, userId);
const leaveChat = (chatId, userId) => Chat.leave(chatId, userId);
const declineInvite = (chatId, userId) => Chat.declineInvite(chatId, userId);
const privateSubscribe = async (chatId, userId, period) => {
  await Chat.privateSubscribe(chatId, userId, period);
};

const getMessagesOffset = (chatId, userId, offset) => {
  if (!chatId) throw new CustomError('Chat not found', 404);
  return Chat.getMessages({ userId, chatId }, { offset });
};

module.exports = {
  isMember,
  getChat,
  subscribeChat,
  leaveChat,
  declineInvite,
  privateSubscribe,
  getMessagesOffset,
};
