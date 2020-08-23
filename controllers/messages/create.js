const {
  broadcastToRoom,
} = require('../../realtime/broadcast');

const {
  createMessage: createMessageService,
} = require('../../services/messages');

const { sendError } = require('../../helpers/responses');


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
  const { id } = req.locals;
  const attachment = getAttachment(req.files);

  const {
    chatType,
    receiverId,
    text,
    type,
  } = req.body;

  const message = await createMessageService(chatType, { text, type, attachment }, { senderId: id, receiverId });
  broadcastToRoom(receiverId, 'message', { ...message, opponent: message.user2 });
  broadcastToRoom(id, 'message', { ...message, opponent: message.user1 });
  return response(message);
};

module.exports = create;
