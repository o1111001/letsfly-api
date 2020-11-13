const {
  createMessage: createMessageService,
} = require('../../services/messages');

const response = message => ({
  message: `Success`,
  data: {
    message,
  },
});

const create = async req => {
  const { id: senderId } = req.locals;
  const {
    chatType,
    destinationId,
    text,
    type,
    membershipsList,
    file: attachment,
    filename,
    waveform,
    resolution,
    duration,
  } = req.body;
  const details = chatType === 'personal' ?
    { senderId, receiverId: destinationId } :
    { senderId, chatId: destinationId, membershipsList };

  const message = await createMessageService(chatType, { text, type, attachment, filename, waveform, resolution, duration }, details);
  return response(message);
};

module.exports = create;
