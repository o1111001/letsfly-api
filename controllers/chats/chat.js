const {
  readMessages: readMessagesService,
  getChats: getChatsService,
} = require('../../services/messages');

const response = (list, isBanned, inBan) => ({
  message: `Success`,
  data: {
    list,
    isBanned,
    inBan,
  },
});

const { sendError } = require('../../helpers/responses');

const getChats = async (req, res) => {
  try {
    const { id } = req.locals;
    const list = await getChatsService(id);
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

const readMessagesInChat = async (req, res) => {
  try {
    const { id: userId } = req.locals;
    const { id: chatId } = req.params;
    const list = await readMessagesService(userId, chatId);
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  getChats,
  readMessagesInChat,
};
