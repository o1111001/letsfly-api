const Tokens = require('../helpers/tokens');
const { verify: Verify } = require('../repositories');

const authorizedNotThrowable = async (req, res, next) => {
  try {
    const { id, token } = await Tokens.verifyStorage(req);
    const verify = new Verify(id, token);
    await verify.tokenFn();
    req.locals = {
      id,
    };
    return next();
  } catch (error) {
    return next();
  }
};

module.exports = authorizedNotThrowable;