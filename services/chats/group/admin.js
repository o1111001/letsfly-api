const Chat = require('../../../repositories/chats');
const { CustomError } = require('../../../helpers/errors');

const createChat = async (fields, usersList, adminId) => {
  const result = await Chat.create(fields, usersList, adminId);
  return result;
};

const changeChat = async fields => {
  const {
    id,
    name,
    description,
    link,
    price,
  } = fields;
  const isFreeLink = await Chat.isFreeLink({ id, link });
  if (!isFreeLink) throw new CustomError('Link is already in use', 409);
  const result = await Chat.update(id, { name, description, link, price });
  return result;
};

const deleteChat = async (userId, chatId) => {
  const activeSubscriptions = await Chat.activeSubscriptions(chatId);
  if (activeSubscriptions.length) throw new CustomError('Chat has got active subscriptions', 409);
  await Chat.deleteChat(chatId);
  return;
};

const createInvites = (chatId, usersList) => Chat.createInvites(chatId, usersList);

const getAdmins = async (senderId, receiverId) => {
  const messagesList = await Chat.getPersonalChatByUserId({ senderId, receiverId });
  return messagesList;
};

const getSubscribers = async (senderId, receiverId) => {
  const messagesList = await Chat.getPersonalChatByUserId({ senderId, receiverId });
  return messagesList;
};

const isChatAdmin = async (adminId, chatId) => {
  const isAdmin = await Chat.isAdmin({ adminId, chatId });
  if (!isAdmin) throw new CustomError('Unauthorized', 403);
  return isAdmin;
};

module.exports = {
  createChat,
  changeChat,
  deleteChat,
  createInvites,
  getAdmins,
  getSubscribers,
  isChatAdmin,
};
