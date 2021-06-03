const { responseCreator } = require('../../../../helpers/responses');

const {
  getChat: getChatService,
  subscribeChat: subscribeChatService,
  leaveChat: leaveChatService,
  declineInvite: declineInviteService,
  privateSubscribe: privateSubscribeChatService,
  getMessagesOffset: getMessagesOffsetService,
} = require('../../services/group/users');

const getChat = async req => {
  const { link } = req.params;
  const userId = (req.locals && req.locals.id) || 0;
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
  const data = await leaveChatService(id, userId);
  return responseCreator(data);
};
const declineInvite = async req => {
  const { chatId } = req.body;
  const { id: userId } = req.locals;
  await declineInviteService(chatId, userId);
  return responseCreator();
};

const getMessagesOffset = async req => {
  const { chatId, offset } = req.query;

  const userId = (req.locals && req.locals.id) || 0;
  const { messages, hasMore } = await getMessagesOffsetService(chatId, userId, offset);
  return responseCreator({ messages, hasMore });
};


module.exports = {
  getChat,
  subscribe,
  privateSubscribe,
  leaveChat,
  declineInvite,
  getMessagesOffset,
};
