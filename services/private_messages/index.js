const PrivateMessagesRepo = require('../../repositories/private_messages');
const UserRepo = require('../../repositories/user/bio');

const { namespace } = require('../../namespaces');
const path = require('path');
const createMessage = async (senderId, receiverId, text, type, attachment) => {
  const privateMessage = new PrivateMessagesRepo(senderId, receiverId, text, type, attachment);
  await privateMessage.checkContact();
  let chat = await privateMessage.checkChat();
  if (!chat) {
    chat = await privateMessage.createChat();
  }
  let attachmentId = null;
  if (attachment) {
    let attachmentType;
    const ext = path.extname(attachment);
    if (type === 'audio') attachmentType = 'audio_message';
    else if (ext === '.mp4') attachmentType = 'video';
    else if (ext === '.mp3') attachmentType = 'audio';
    else if (['.png', '.jpg', '.jpeg'].includes(ext)) attachmentType = 'photo';
    else attachmentType = 'another';
    const { id } = await privateMessage.createAttachment(attachmentType);
    attachmentId = id;
  }

  const { id: chatId, user1, user2 } = chat;
  const message = await privateMessage.create(chatId, attachmentId);
  const user = new UserRepo(senderId);
  const { username, firstName, lastName, email, contact } = await user.get(receiverId);
  const { count } = await privateMessage.unReadMessagesInChat(chatId);
  let displayedName;
  if (contact) {
    displayedName = (await user.getUser(receiverId)).displayedName;
  }
  return { ...message, user1, user2, username, firstName, lastName, email, displayedName, count };
};

const getMessageListPreview = async senderId => {
  const privateMessages = new PrivateMessagesRepo(senderId);
  const messagesList = privateMessages.getMessageListPreview();
  return messagesList;
};

const getChatByUserId = async (senderId, receiverId) => {
  const privateMessages = new PrivateMessagesRepo(senderId, receiverId);
  const messagesList = privateMessages.getChatByUserId();
  return messagesList;
};

const deleteMessageById = async (userId, messageId) => {
  const privateMessages = new PrivateMessagesRepo(userId);
  const message = await privateMessages.get(messageId);
  if (!message) throw 'Message not found';
  const { chatId } = message;
  const chat = await privateMessages.getChat(chatId);
  if (chat.user1 !== userId && chat.user2 !== userId) throw 'Permission denied';
  await privateMessages.deleteMessageById(messageId);
};

const readMessages = async (userId, messageId) => {
  const privateMessages = new PrivateMessagesRepo(userId);
  const message = await privateMessages.get(messageId);
  if (!message) throw 'Message not found';
  const { chatId } = message;
  const chat = await privateMessages.getChat(chatId);
  if (chat.user1 !== userId && chat.user2 !== userId) {
    throw 'Permission denied';
  }
  await privateMessages.readMessages(chatId, userId);
  // const socketTarget = userId === chat.user1 ? chat.user2 : chat.user1;
  const response = {
    id: userId,
    chatId,
  };
  namespace.to(chat.user1).emit('private_message_read', response);
  namespace.to(chat.user2).emit('private_message_read', response);

};

const getChats = async senderId => {
  const privateMessages = new PrivateMessagesRepo(senderId);
  const chats = await privateMessages.getChats();
  return chats;
};

const getFiles = async (id, userId, type) => {
  const privateMessages = new PrivateMessagesRepo();
  const chats = await privateMessages.getFiles(id, userId, type);
  return chats;
};

module.exports = {
  createMessage,
  getMessageListPreview,
  getChatByUserId,
  deleteMessageById,
  readMessages,
  getChats,
  getFiles,
};
