const {
  getChatByUserId: getChatByUserIdService,
  getFiles: getFilesService,
  getCountAttachments: getCountAttachmentsService,
} = require('../../services/chats/personal');

const {
  checkBan: checkBanService,
} = require('../../services/user/ban');

const response = (list, isBanned, inBan) => ({
  message: `Success`,
  data: {
    list,
    isBanned,
    inBan,
  },
});

const getChatByUserId = async req => {
  const { id } = req.params;
  const { id: userId } = req.locals;
  const list = await getChatByUserIdService(userId, id);
  const { isBanned, inBan } = await checkBanService(userId, id);
  return response(list, isBanned, inBan);
};

const getFiles = async req => {
  const chatType = 'personal';
  const { id } = req.locals;
  const { id: userId, type } = req.params;

  const list = await getFilesService(chatType, type, { user1: id, user2: userId });
  return response(list);
};

const getCountAttachmentsFromChat = async req => {
  const { id } = req.params;
  const { id: userId } = req.locals;

  const list = await getCountAttachmentsService(userId, id);
  // const { isBanned, inBan } = await checkBanService(userId, id);
  return response(list);
};

module.exports = {
  getChatByUserId,
  getFiles,
  getCountAttachmentsFromChat,
};
