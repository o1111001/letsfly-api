const {
  getChatByUserId: getChatByUserIdService,
  getFiles: getFilesService,
  getCountAttachments: getCountAttachmentsService,
  getInitFiles: getInitFilesService,
  getMessagesOffset: getMessagesOffsetService,
} = require('../services/personal');

const {
  checkBan: checkBanService,
} = require('../../user/services/ban');
const { responseCreator } = require('../../../helpers/responses');

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
  const { from } = req.query;
  const { messages, hasMore } = await getChatByUserIdService(userId, id, from);
  const { isBanned, inBan } = await checkBanService(userId, id);
  const files = await getInitFilesService('personal', { user1: id, user2: userId });
  return responseCreator({ messages, hasMore, isBanned, inBan, files, type: 'personal' });
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
  list.files = {
    media: { count: 1, list: [] },
    audio: { count: 1, list: [] },
    audio_message: { count: 1, list: [] },
    file: { count: 1, list: [] },
  };
  // const { isBanned, inBan } = await checkBanService(userId, id);
  return response(list);
};

const getMessagesOffset = async req => {
  const { offset = 0 } = req.query;
  const { id: userId } = req.locals;
  const { id } = req.params;
  const { messages, hasMore } = await getMessagesOffsetService(userId, id, offset);
  return responseCreator({ messages, hasMore });
};

module.exports = {
  getChatByUserId,
  getFiles,
  getCountAttachmentsFromChat,
  getMessagesOffset,
};
