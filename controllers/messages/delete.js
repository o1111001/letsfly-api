const {
  deleteMessageById: deleteMessageByIdService,
} = require('../../services/messages');

const { sendError } = require('../../helpers/responses');

const response = () => ({
  message: `Success`,
});

const deleteMessageById = async (req, res) => {
  try {
    const { id: messageId } = req.body;
    const { id: userId } = req.locals;

    await deleteMessageByIdService(userId, messageId);
    return res.send(response());
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = deleteMessageById;
