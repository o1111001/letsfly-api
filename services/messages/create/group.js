const Message = require('../../../repositories/message');
const Chat = require('../../../repositories/chats');

const {
  broadcastToSetOfRooms,
} = require('../../../realtime/broadcast');

module.exports = async (data, details) => {
  const { text, type, attachment, attachmentId } = data;
  const { senderId, chatId } = details;


  const newMessage = await Message.create({ chatId, senderId, text, type, attachment, attachmentId });
  const chat = await Chat.get(chatId);

  const users = chat.type === 'private' ? await Chat.getPrivateSubscribers(chatId) : await Chat.getSubscribers(chatId);
  const message = {
    ...newMessage,
    opponent: chat,
    chatType: chat.type,
  };
  broadcastToSetOfRooms([...users, senderId], 'message', message);

  return { ...newMessage };
};
