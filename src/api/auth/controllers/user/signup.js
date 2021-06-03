const { signUp: service } = require('../../../auth/services');

const response = email => ({
  message: `Code sent to ${email}`,
  data: {
    email,
  },
});

const signUp = async req => {
  const { email } = req.body;
  await service(email);
  return response(email);
};

module.exports = signUp;
