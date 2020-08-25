const { responseCreator } = require('../../../helpers/responses');

const {
  createChat: createChatService,
  changeChat: changeChatService,
  deleteChat: deleteChatService,
  createInvites: createInvitesService,
  // getAdmins: getAdminsService,
  // getSubscribers: getSubscribersService,

  isChatAdmin: isChatAdminService,
} = require('../../../services/chats/group/admin');

const createChat = async req => {
  const { id: adminId } = req.locals;
  const {
    type,
    name,
    description,
    link,
    price,
    avatar,
    usersList,
  } = req.body;

  const chatId = await createChatService({
    type,
    name,
    description,
    link,
    price,
    avatar,
  }, usersList, adminId);

  return responseCreator({ chatId });
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

// const getAdmins = async req => {
//   const { id } = req.params;
//   const { id: userId } = req.locals;

//   return response(list);
// };

// const getSubscribers = async req => {
//   const { id } = req.params;
//   const { id: userId } = req.locals;

//   return response(list);
// };

module.exports = {
  createChat,
  changeChat,
  deleteChat,
  createInvites,
  // getAdmins,
  // getSubscribers,
};
