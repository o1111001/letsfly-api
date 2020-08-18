const {
  createMessage: createMessageService,
  getChatByUserId: getChatByUserIdService,
  deleteMessageById: deleteMessageByIdService,
  readMessages: readMessagesService,
  getChats: getChatsService,
  getFiles: getFilesService,
  getMessagesChatByUserId: getMessagesChatByUserIdService,
  getCountAttachments: getCountAttachmentsService,
} = require('../../services/private_messages');

const {
  user: {
    checkBan: checkBanService,
  },
} = require('../../services/user');

const { sendError } = require('../../helpers/responses');

const { namespace } = require('../../namespaces');


const response = (list, isBanned, inBan) => ({
  message: `Success`,
  data: {
    list,
    isBanned,
    inBan,
  },
});

const create = async (req, res) => {
  try {
    const { id } = req.locals;

    let attachment = null;
    if (req.files && req.files.file && req.files.file[0]) {
      attachment = req.files.file[0].path;
    }
    const {
      chatType,
      receiverId,
      text,
      type,
    } = req.body;
    const message = await createMessageService(chatType, id, receiverId, text, type, attachment);
    namespace.to(receiverId).emit('private_message', message);
    message.user1.displayedName = undefined;
    message.user2.displayedName = undefined;

    namespace.to(id).emit('private_message', message);
    return res.send(message);
  } catch (error) {
    return sendError(res, error);
  }
};

const getChatByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.locals;

    const list = await getChatByUserIdService(userId, id);
    const { isBanned, inBan } = await checkBanService(userId, id);
    return res.send(response(list, isBanned, inBan));
  } catch (error) {
    return sendError(res, error);
  }
};

const getCountAttachments = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.locals;

    const list = await getCountAttachmentsService(userId, id);
    // const { isBanned, inBan } = await checkBanService(userId, id);
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

const getMessagesChatByUserId = async (req, res) => {
  try {
    const { id, messageId } = req.params;
    const { id: userId } = req.locals;
    const list = await getMessagesChatByUserIdService(userId, id, messageId);
    const { isBanned, inBan } = await checkBanService(userId, id);
    return res.send(response(list, isBanned, inBan));
  } catch (error) {
    return sendError(res, error);
  }
};

const readMessages = async (req, res) => {
  try {
    const { id: userId } = req.locals;
    const { id: messageId } = req.params;
    const list = await readMessagesService(userId, messageId);
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteMessageById = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { id: userId } = req.locals;

    await deleteMessageByIdService(userId, messageId);
    return res.send(response());
  } catch (error) {
    return sendError(res, error);
  }
};

const getChats = async (req, res) => {
  try {
    const { id } = req.locals;
    const list = await getChatsService(id);
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

const getFiles = async (req, res) => {
  try {
    const { id } = req.locals;
    const { id: userId, type } = req.params;

    const list = await getFilesService(id, userId, type);
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  create,
  getChatByUserId,
  deleteMessageById,
  readMessages,
  getChats,
  getFiles,
  getMessagesChatByUserId,
  getCountAttachments,
};

