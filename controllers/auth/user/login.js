const { login: service } = require('../../../services/auth');

const response = (email, token) => ({
  message: `Logged in`,
  data: {
    email,
    token,
  },
});

const login = async req => {
  const { email, code } = req.body;
  const token = await service(email, code);
  return response(email, token);
};

module.exports = login;
