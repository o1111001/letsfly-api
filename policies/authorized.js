const Tokens = require('../helpers/tokens');
const { verify: Verify } = require('../repositories');

const authorized = async (req, res, next) => {
  try {
    const { id, token } = await Tokens.verifyStorage(req);=
    const verify = new Verify(id, token);
    await verify.tokenFn();
    req.locals = {
      id,
    };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authorized;
