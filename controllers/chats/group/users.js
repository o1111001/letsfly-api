const { responseCreator } = require('../../../helpers/responses');

const {
  getChat: getChatService,
  subscribeChat: subscribeChatService,
  leaveChat: leaveChatService,
  declineInvite: declineInviteService,
  privateSubscribe: privateSubscribeChatService,
} = require('../../../services/chats/group/users');

const getChat = async req => {
  const { link } = req.params;
  const userId = (req.locals && req.locals.id) ? req.locals.id : -1;
  const chat = await getChatService(link, userId);
  return responseCreator({ chat });
};

const subscribe = async req => {
  const { id } = req.body;
  const { id: userId } = req.locals;
  await subscribeChatService(id, userId);
  return responseCreator();
};

const privateSubscribe = async req => {
  const { chatId, period } = req.body;
  const { id: userId } = req.locals;
  await privateSubscribeChatService(chatId, userId, period);
  return responseCreator();
};

const leaveChat = async req => {
  const { id } = req.body;
  const { id: userId } = req.locals;
  await leaveChatService(id, userId);
  return responseCreator();
};
const declineInvite = async req => {
  const { chatId } = req.body;
  const { id: userId } = req.locals;
  await declineInviteService(chatId, userId);
  return responseCreator();
};


module.exports = {
  getChat,
  subscribe,
  privateSubscribe,
  leaveChat,
  declineInvite,
};
