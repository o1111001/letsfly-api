const Admin = require('../repositories/admin');
const { CustomError } = require('../helpers/errors');

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
    throw new CustomError('Unauthorized', 403);
  } catch (error) {
    return next(error);
  }
};

module.exports = isAdmin;
