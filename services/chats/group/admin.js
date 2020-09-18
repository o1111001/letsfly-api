const Chat = require('../../../repositories/chats');
const { CustomError } = require('../../../helpers/errors');

const createChat = (fields, usersList, adminId) => Chat.create(fields, usersList, adminId);

const updateAvatar = (chatId, avatar) => Chat.updateAvatar(chatId, avatar);

const changeChat = async fields => {
  const {
    id,
    name,
    description,
    link,
    price,
    avatar,
  } = fields;
  const isFreeLink = await Chat.isFreeLink({ id, link });
  if (!isFreeLink) throw new CustomError('Link is already in use', 409);
  const result = await Chat.update(id, { name, description, link, price, avatar });
  return result;
};

const deleteChat = async (userId, chatId) => {
  const activeSubscriptions = await Chat.activeSubscriptions(chatId);
  if (activeSubscriptions.length) throw new CustomError('Chat has got active subscriptions', 409);
  await Chat.deleteChat(chatId);
  return;
};

const createInvites = (chatId, usersList) => Chat.createInvites(chatId, usersList);

const getAdmins = chatId => Chat.getAdmins(chatId);

const getSubscribers = chatId => Chat.getSubscribers(chatId);

const isChatAdmin = async (adminId, chatId) => {
  const isAdmin = await Chat.isAdmin({ adminId, chatId });
  if (!isAdmin) throw new CustomError('Unauthorized', 403);
  return isAdmin;
};

const getContacts = (chatId, userId) => Chat.getContactsInChat({ chatId, userId });
const getContactsForNewChat = (userId, link) => Chat.getContactsForNewChat({ userId, link });
const checkLink = link => Chat.isFreeLink({ id: -1, link });
const joinUsers = (link, usersList) => Chat.joinUsers({ link, usersList });
module.exports = {
  createChat,
  changeChat,
  deleteChat,
  createInvites,
  getAdmins,
  getSubscribers,
  isChatAdmin,
  getContacts,
  getContactsForNewChat,
  checkLink,
  updateAvatar,
  joinUsers,
};
