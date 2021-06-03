const { CustomError } = require('../../../../helpers/errors');

const response = () => ({
  message: `Success`,
});

const verify = async req => {
  if (req.locals && req.locals.id) return response();
  throw new CustomError('Not authorized', 403);
};

module.exports = verify;
