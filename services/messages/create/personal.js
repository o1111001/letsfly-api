const Message = require('../../../repositories/message');
const Chat = require('../../../repositories/chats');
const PersonalChat = require('../../../repositories/chats/personal');

const UserRepo = require('../../../repositories/user/bio');
const User = new UserRepo();

module.exports = async (data, details) => {
  const { text, type, attachment, attachmentId } = data;
  const { senderId, receiverId } = details;

  let chatId = await PersonalChat.findIdOfPersonalChat({ senderId, receiverId });
  if (!chatId) {
    chatId = await Chat.create({ type: 'personal' }, [senderId, receiverId]);
  }

  const newMessage = await Message.create({ chatId, senderId, text, type, attachment, attachmentId });
  const { count } = await Chat.countUnReadMessagesInChat({ chatId, userId: receiverId });
  const [user1, user2] = await Promise.all([
    User.getUser({ id: receiverId, me: senderId }),
    User.getUser({ id: senderId, me: senderId }),
  ]);

  return { ...newMessage, user1, user2, count, chatType: 'personal' };
};
