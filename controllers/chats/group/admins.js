const { responseCreator } = require('../../../helpers/responses');

const {
  createChat: createChatService,
  changeChat: changeChatService,
  deleteChat: deleteChatService,
  createInvites: createInvitesService,
  getAdmins: getAdminsService,
  getSubscribers: getSubscribersService,
  getContacts: getContactsService,
  getContactsForNewChat: getContactsForNewChatService,
  isChatAdmin: isChatAdminService,
  checkLink: checkLinkService,
  updateAvatar: updateAvatarService,
  joinUsers: joinUsersService,
} = require('../../../services/chats/group/admin');


const createChat = async req => {
  const { id: adminId } = req.locals;
  const {
    type,
    name,
    description,
    link,
    price,
    usersList,
    avatar,
  } = req.body;

  const chatId = await createChatService({
    type,
    name,
    description,
    link,
    price,
    avatar,
  },
  [],
  adminId,
  );
  return responseCreator({ chatId });
};

const updateAvatar = async req => {
  const { id: userId } = req.locals;
  const {
    id: chatId,
    avatar,
  } = req.body;
  await isChatAdminService(userId, chatId);
  await updateAvatarService(chatId, avatar);
  return responseCreator({ chatId, avatar });
};

const changeChat = async req => {
  const {
    id,
    name,
    description,
    link,
    price,
  } = req.body;
  const { id: userId } = req.locals;
  await isChatAdminService(userId, id);
  await changeChatService({
    id,
    name,
    description,
    link,
    price,
  });
  return responseCreator();
};

const deleteChat = async req => {
  const { id } = req.body;
  const { id: userId } = req.locals;
  await isChatAdminService(userId, id);
  await deleteChatService(userId, id);

  return responseCreator();
};

const createInvites = async req => {
  const { usersList, chatId } = req.body;
  const { id: userId } = req.locals;
  await isChatAdminService(userId, chatId);
  await createInvitesService(chatId, usersList);

  return responseCreator();
};

const joinUsers = async req => {
  const { usersList, membershipId } = req.body;
  const { id: userId } = req.locals;
  const chatId = await getChatIdByMembershipId(membershipId);
  await isChatAdminService(userId, chatId);
  await joinUsersService(membershipId, usersList);

  return responseCreator();
};

const getAdmins = async req => {
  const { id: chatId } = req.params;
  const { id: userId } = req.locals;
  const list = await getAdminsService(userId, chatId);
  return responseCreator({ list });
};

const getSubscribers = async req => {
  const { id: chatId } = req.params;
  const { id: userId } = req.locals;
  await isChatAdminService(userId, chatId);
  const list = await getSubscribersService(userId, chatId);
  return responseCreator({ list });
};

const getContacts = async req => {
  const { id: chatId } = req.params;
  const { id: userId } = req.locals;
  await isChatAdminService(userId, chatId);
  const list = await getContactsService(userId, chatId);
  return responseCreator({ list });
};

const getContactsForNewChat = async req => {
  const { id: userId } = req.locals;
  const { link } = req.params;
  const list = await getContactsForNewChatService(userId, link);
  return responseCreator({ list });
};

const checkLink = async req => {
  const { link } = req.params;
  const isFreeLink = await checkLinkService(link);
  return responseCreator({ isFreeLink });
};

module.exports = {
  createChat,
  changeChat,
  deleteChat,
  createInvites,
  getAdmins,
  getSubscribers,
  getContacts,
  getContactsForNewChat,
  checkLink,
  joinUsers,
  updateAvatar,
};
