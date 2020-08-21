const { login: service } = require('../../../services/auth');

const { sendError } = require('../../../helpers/responses');

const Cookies = require('../../../helpers/cookies');
const response = (email, token) => ({
  message: `Logged in`,
  data: {
    email,
    token,
  },
});

const {
  EXPIRES,
} = require('../../../config/env');

const login = async (req, res) => {
  try {
    const { email, code } = req.body;
    const token = await service(email, code);
    await Cookies.auth(res, token, EXPIRES, response(email, token));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = login;
