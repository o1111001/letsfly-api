const Chat = require('../../../repositories/chats');

const getChat = async (link, userId) => {
  const chat = await Chat.getFull(link, userId || -1);
  if (!chat) return {};
  const files = await Chat.countAttachmentsInChat(chat.type, { chatId: chat.id, userId });
  return { chat, files };
};

const subscribeChat = (chatId, userId) => Chat.subcribe(chatId, userId);
const leaveChat = (chatId, userId) => Chat.leave(chatId, userId);
const declineInvite = (chatId, userId) => Chat.declineInvite(chatId, userId);
const privateSubscribe = async (chatId, userId, period) => {
  await Chat.privateSubscribe(chatId, userId, period);
};

module.exports = {
  getChat,
  subscribeChat,
  leaveChat,
  declineInvite,
  privateSubscribe,
};
