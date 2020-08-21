const {
  getChatByUserId: getChatByUserIdService,
  getFiles: getFilesService,
  getCountAttachments: getCountAttachmentsService,

} = require('../../services/messages');

const {
  checkBan: checkBanService,
} = require('../../services/user/ban');

const { sendError } = require('../../helpers/responses');


const response = (list, isBanned, inBan) => ({
  message: `Success`,
  data: {
    list,
    isBanned,
    inBan,
  },
});

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

const getFiles = async (req, res) => {
  try {
    const chatType = 'personal';
    const { id } = req.locals;
    const { id: userId, type } = req.params;

    const list = await getFilesService(chatType, type, { user1: id, user2: userId });
    return res.send(response(list));
  } catch (error) {
    return sendError(res, error);
  }
};

const getCountAttachmentsFromChat = async (req, res) => {
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

module.exports = {
  getChatByUserId,
  getFiles,
  getCountAttachmentsFromChat,
};
