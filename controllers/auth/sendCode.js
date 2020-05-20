const { sendCode: service } = require('../../services/auth');

const { sendError } = require('../../helpers/responses');

const response = email => ({
  message: `Code sent to ${email}`,
  data: {
    email,
  },
});

const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    await service(email);
    return res.send(response(email));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = sendCode;
