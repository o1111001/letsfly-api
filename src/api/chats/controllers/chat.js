const {
  readMessages: readMessagesService,
  getChats: getChatsService,
} = require('../services/personal');

const response = (list, isBanned, inBan) => ({
  message: `Success`,
  data: {
    list,
    isBanned,
    inBan,
  },
});

const getChats = async req => {
  const { id } = req.locals;
  const list = await getChatsService(id);
  return response(list);
};

const readMessagesInChat = async req => {
  const { id: userId } = req.locals;
  const { id: messageId } = req.params;
  const list = await readMessagesService(userId, messageId);
  return response(list);
};

module.exports = {
  getChats,
  readMessagesInChat,
};
