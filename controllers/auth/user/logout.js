const { logout: service } = require('../../../services/auth');

module.exports = async (req, res) => {
  const { refresh } = req.cookies;
  if (refresh) {
    await service(refresh);
  }
  return res.cookie('refresh', '', {
    expires: new Date(2 ** 41 - 1),
    secure: false,
    httpOnly: true,
  }).send({});
};

