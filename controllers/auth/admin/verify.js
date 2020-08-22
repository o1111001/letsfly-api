const { CustomError } = require('../../../helpers/errors');

const response = () => ({
  message: `Success`,
});

const verifyAdmin = async req => {
  if (req.locals && req.locals.id && req.locals.isAdmin) return response();
  throw new CustomError('Not authorized', 403);
};

module.exports = verifyAdmin;
