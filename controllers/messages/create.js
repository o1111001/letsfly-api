const {
  createMessage: createMessageService,
} = require('../../services/messages');

const response = message => ({
  message: `Success`,
  data: {
    message,
  },
});

const getAttachment = files => {
  if (files && files.file && files.file[0]) {
    return files.file[0].path;
  }
  return null;
};

const create = async req => {
  const { id: senderId } = req.locals;
  const attachment = getAttachment(req.files);

  const {
    chatType,
    receiverId,
    chatId,
    text,
    type,
  } = req.body;
  const details = chatType === 'personal' ? { senderId, receiverId } : { senderId, chatId };
  const message = await createMessageService(chatType, { text, type, attachment }, details);
  return response(message);
};

module.exports = create;
