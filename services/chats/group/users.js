const Chat = require('../../../repositories/chats');

const isMember = ({ userId, chatId }) => Chat.isMember({ userId, chatId });

const getChat = async (link, userId) => {
  const chat = await Chat.getFull(link, userId || -1);
  if (!chat) return {};
  chat.messages = await Chat.getMessages(userId, chat.id);
  chat.files = await Chat.getInitFiles(chat.type, { chatId: chat.id, userId });
  return chat;
};

const subscribeChat = (chatId, userId) => Chat.subcribe(chatId, userId);
const leaveChat = (chatId, userId) => Chat.leave(chatId, userId);
const declineInvite = (chatId, userId) => Chat.declineInvite(chatId, userId);
const privateSubscribe = async (chatId, userId, period) => {
  await Chat.privateSubscribe(chatId, userId, period);
};

module.exports = {
  isMember,
  getChat,
  subscribeChat,
  leaveChat,
  declineInvite,
  privateSubscribe,
};
