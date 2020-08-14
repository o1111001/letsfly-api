const Admin = require('../repositories/admin');
const { sendUnauthorized } = require('../helpers/responses');

const isAdmin = async (req, res, next) => {
  try {
    const { id } = req.locals;
    const { adminToken } = req.query;
    const admin = new Admin();
    const isAdmin = await admin.check(id);
    const { token } = isAdmin;
    if (isAdmin && adminToken === token) {
      req.locals.isAdmin = true;
      return next();
    }
    return sendUnauthorized(res, 'Unauthorized');
  } catch (error) {
    return sendUnauthorized(res, error);
  }
};

module.exports = isAdmin;
