const { adminLogin: service } = require('../../services/auth');

const { sendError } = require('../../helpers/responses');

const Cookies = require('../../helpers/cookies');
const response = token => ({
  message: `Logged in`,
  data: {
    token,
  },
});

const {
  EXPIRES,
} = require('../../config/env');

const adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.locals;
    const token = await service(id, password);
    await Cookies.auth(res, token, EXPIRES, response(token));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = adminLogin;
