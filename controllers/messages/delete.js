const {
  deleteMessageById: deleteMessageByIdService,
} = require('../../services/messages');

const response = () => ({
  message: `Success`,
});

const deleteMessageById = async req => {
  const { id: messageId } = req.body;
  const { id: userId } = req.locals;

  await deleteMessageByIdService(userId, messageId);
  return response();
};

module.exports = deleteMessageById;
