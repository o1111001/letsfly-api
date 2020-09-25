const Chat = require('../../../repositories/chats');

const isMember = ({ userId, chatId }) => Chat.isMember({ userId, chatId });

const getChat = async (link, userId) => {
  const chat = await Chat.getFull(link, userId || -1);
  if (!chat) return {};
  chat.messages = await Chat.getMessages(userId, chat.id);
  console.log(123, chat.messages);
  // const files = await Chat.countAttachmentsInChat(chat.type, { chatId: chat.id, userId });
  const files = {
    photo: 0,
    video: 0,
    audio: 0,
    audio_message: 0,
    another: 0,
  };
  return { chat, files };
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
