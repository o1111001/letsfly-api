const Tokens = require('../helpers/tokens');

const authorizedNotThrowable = async (req, res, next) => {
  try {
    const { id } = await Tokens.verifyStorage(req);
    req.locals = {
      id,
    };
    return next();
  } catch (error) {
    return next();
  }
};

module.exports = authorizedNotThrowable;
