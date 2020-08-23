const { sendCode: service } = require('../../../services/auth');

const response = email => ({
  message: `Code sent to ${email}`,
  data: {
    email,
  },
});

const sendCode = async req => {
  const { email } = req.body;
  await service(email);
  return response(email);
};

module.exports = sendCode;
