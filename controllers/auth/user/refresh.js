const { refresh: service } = require('../../../services/auth');
const {
  EXPIRES_REFRESH,
} = require('../../../config/env');
const response = (token, expired) => ({
  message: `Refreshed`,
  data: {
    token,
    expired,
  },
});

const wrongResponse = () => ({
  message: `Something went wrong`,
});

module.exports = async (req, res) => {
  if (!req.cookies || !req.cookies.refresh || !req.body || !req.body.fingerprint) {
    return res.send(wrongResponse()).status(422);
  }

  const { id } = req.locals;
  const { refresh: clientRefresh } = req.cookies;
  const { fingerprint } = req.body;
  const { access, refresh, expirationAccess } = await service(id, clientRefresh, fingerprint);
  return res.cookie('refresh', refresh, {
    expires: new Date(Date.now() + EXPIRES_REFRESH),
    secure: false,
    httpOnly: true,
  }).send(response(access, expirationAccess));
};

