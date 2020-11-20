const Tokens = require('../helpers/tokens');

const authorized = async (req, res, next) => {
  try {
    const { id } = await Tokens.verifyStorage(req);

    req.locals = {
      id,
    };
    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = authorized;
