const { adminLogin: service } = require('../../../services/auth');

const response = token => ({
  message: `Logged in`,
  data: {
    token,
  },
});

const adminLogin = async req => {
  const { password } = req.body;
  const { id } = req.locals;
  const token = await service(id, password);
  return response(token);
};

module.exports = adminLogin;
