const PrivateMessagesRepo = require('../../repositories/message');
const Chat = require('../../repositories/chats');

const UserRepo = require('../../repositories/user/bio');
const User = new UserRepo();
const { namespace } = require('../../namespaces');


const getChatByUserId = async (senderId, receiverId) => {
  const messagesList = await Chat.getPersonalChatByUserId({ senderId, receiverId });
  return messagesList;
};

const getCountAttachments = async (senderId, receiverId) => {
  const type = 'personal';
  const messagesList = Chat.countAttachmentsInChat(type, { senderId, receiverId });
  return messagesList;
};


const deleteMessageById = async (userId, messageId) => {
  const privateMessages = new PrivateMessagesRepo(userId);
  const message = await privateMessages.get({ id: messageId });
  if (!message) throw 'Message not found';
  if (message.senderId !== userId) throw 'Permission denied';
  await privateMessages.deleteById({ id: messageId });
};

const readMessages = async (userId, chatId) => {
  const { type } = await Chat.get(chatId);

  if (type === 'personal') {

    const isMemberOfChat = await Chat.isMember({ userId, chatId });
    if (!isMemberOfChat) {
      throw 'Permission denied';
    }

    const members = await Chat.getMembers({ userId, chatId });
    const user1Id = members[0].userId;
    const user2Id = members[1].userId;


    const [user1, user2] = await Promise.all([
      User.getUser({ id: user1Id, me: userId }),
      User.getUser({ id: user2Id, me: userId }),
    ]);
    await Chat.readMessages(type, { chatId, userId });
    const response = {
      id: userId,
      chatId,
    };



    namespace.to(user1Id).emit('private_message_read', { ...response, opponent: user2 });
    namespace.to(user2Id).emit('private_message_read', { ...response, opponent: user1 });
  }
};

const getChats = async userId => {
  const chats = await Chat.getAll({ userId });
  return chats;
};

const getFiles = async (user1, user2, fileType) => {
  const type = 'personal';
  const files = await Chat.getFilesFromChat(type, fileType, { user1, user2 });
  return files;
};

module.exports = {
  createMessage: require('./create'),
  getChatByUserId,
  deleteMessageById,
  readMessages,
  getChats,
  getFiles,
  getCountAttachments,
};
