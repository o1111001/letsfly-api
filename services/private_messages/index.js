const PrivateMessagesRepo = require('../../repositories/private_messages');
const UserRepo = require('../../repositories/user/bio');

const { namespace } = require('../../namespaces');
const path = require('path');
const createMessage = async (senderId, receiverId, text, type, attachment) => {
  const message = new PrivateMessagesRepo(senderId, receiverId, text, type, attachment);
  // await privateMessage.checkContact();
  let chat = await message.checkChat();
  if (!chat) {
    chat = await message.createChat();
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
    const { id } = await message.createAttachment(attachmentType);
    attachmentId = id;
  }

  const { id: chatId, user1, user2 } = chat;
  const newMessage = await message.create(chatId, attachmentId);
  const user = new UserRepo(senderId);
  const { username, firstName, lastName, email } = await user.get(receiverId);
  const { count } = await message.unReadMessagesInChat(chatId);

  return { ...newMessage, user1, user2, username, firstName, lastName, email, count };
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

const getCountAttachments = async (senderId, receiverId) => {
  const privateMessages = new PrivateMessagesRepo(senderId, receiverId);
  const messagesList = privateMessages.getCountAttachments();
  return messagesList;
};

const getMessagesChatByUserId = async (senderId, receiverId, id) => {
  const privateMessages = new PrivateMessagesRepo(senderId, receiverId);
  const messagesList = privateMessages.getMessagesChatByUserId(id);
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
  const response = {
    id: userId,
    chatId,
  };
  namespace.to(chat.user1).emit('private_message_read', { ...response, opponent: chat.user2 });
  namespace.to(chat.user2).emit('private_message_read', { ...response, opponent: chat.user1 });

};

const getChats = async senderId => {
  const privateMessages = new PrivateMessagesRepo(senderId);
  const chats = await privateMessages.getChats();
  return chats;
};

const getFiles = async (id, userId, type) => {
  const privateMessages = new PrivateMessagesRepo();
  const files = await privateMessages.getFiles(id, userId, type);
  return files;
};

module.exports = {
  createMessage: require('./create'),
  getMessageListPreview,
  getChatByUserId,
  deleteMessageById,
  readMessages,
  getChats,
  getFiles,
  getMessagesChatByUserId,
  getCountAttachments,
};
