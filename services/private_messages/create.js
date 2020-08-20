const Message = require('../../repositories/message');
const Chat = require('../../repositories/chats');

const UserRepo = require('../../repositories/user/bio');
const User = new UserRepo();

const { checkAttachmentFileType } = require('../../helpers/messages');

module.exports = async (chatType, senderId, receiverId, text, type, attachment) => {

  let attachmentId = null;
  if (attachment) {
    const type = checkAttachmentFileType(attachment);
    attachmentId = await Message.createAttachment({ attachment, type });
  }

  if (chatType === 'personal') {
    const chat = {};
    chat.id = await Chat.findIdOfPersonalChat({ senderId, receiverId });
    if (!chat.id) {
      const createdChat = await Chat.create({ type: 'personal' });
      chat.id = createdChat.id;
      await Promise.all([
        Chat.join({ chatId: chat.id, userId: senderId }),
        Chat.join({ chatId: chat.id, userId: receiverId }),
      ]);
    }
    console.log(receiverId, senderId);
    const [user1, user2] = await Promise.all([
      User.getUser({ id: receiverId, me: senderId }),
      User.getUser({ id: senderId, me: senderId }),
    ]);
    console.log(user1, user2);
    const newMessage = await Message.create({ chatId: chat.id, senderId, text, type, attachment, attachmentId });
    const { count } = await Chat.countUnReadMessagesInChat({ chatId: chat.id, userId: receiverId });
    return { ...newMessage, user1, user2, count, chatType };
  }


  return {};
};
