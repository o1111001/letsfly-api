const Chat = require('../../repositories/chats');
const PersonalChat = require('../../repositories/chats/personal');

const { CustomError } = require('../../helpers/errors');
const { broadcastToSetOfRooms } = require('../../realtime/broadcast');

const getChatByUserId = (senderId, receiverId, from) => PersonalChat.getPersonalChatByUserId({ senderId, receiverId, from });

const getCountAttachments = (senderId, receiverId) => Chat.countAttachmentsInChat('personal', { senderId, receiverId });

const readMessages = async (userId, messageId) => {
  const data = await Chat.getChatByMessageId(messageId);
  const { chatId, type } = data;
  const members = await Chat.getMembers({ userId, chatId });
  if (!members.includes(userId)) {
    throw new CustomError('Permission denied', 403);
  }
  await Chat.readMessages(type, { messageId, userId });

  const response = {
    id: userId,
    chatId,
  };

  broadcastToSetOfRooms(members, 'message_read', response);
  return;
};

const getChats = userId => Chat.getAll({ userId });

const getFiles = (chatType, fileType, details) => Chat.getFilesFromChat(chatType, fileType, details);
const getInitFiles = (chatType, details) => Chat.getInitFiles(chatType, details);

const getMessagesOffset = (senderId, receiverId, offset) => PersonalChat.getPersonalChatByUserId({ senderId, receiverId, offset });

module.exports = {
  getChatByUserId,
  readMessages,
  getChats,
  getFiles,
  getCountAttachments,
  getInitFiles,
  getMessagesOffset,
};
