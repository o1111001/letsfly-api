const { login: service } = require('../../../services/auth');
const {
  EXPIRES_REFRESH,
} = require('../../../config/env');
const response = (email, token, expiration) => ({
  message: `Logged in`,
  data: {
    email,
    token,
    expiration,
  },
});

const wrongResponse = () => ({
  message: `Something went wrong`,
});

const login = async (req, res) => {
  try {
    const { email, code, fingerprint } = req.body;
    const { access, refresh, expirationAccess } = await service(email, code, fingerprint);
    return res.cookie('refresh', refresh, {
      expires: new Date(Date.now() + EXPIRES_REFRESH),
      secure: false,
      httpOnly: true,
    }).send(response(email, access, expirationAccess));
  } catch (error) {
    return res.status(422).send(wrongResponse());
  }
};

module.exports = login;
