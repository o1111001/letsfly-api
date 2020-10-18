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
    receiverId,
    chatId,
    text,
    type,
    membershipsList,
    file: attachment,
    waveform,
  } = req.body;
  const details = chatType === 'personal' ?
    { senderId, receiverId } :
    { senderId, chatId, membershipsList };

  const message = await createMessageService(chatType, { text, type, attachment, waveform }, details);
  return response(message);
};

module.exports = create;
