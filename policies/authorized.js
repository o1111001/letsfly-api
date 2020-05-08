const Tokens = require('../helpers/tokens');
const { verify: Verify } = require('../repositories');
const { sendUnauthorized } = require('../helpers/responses');


const authorized = async (req, res, next) => {
  try {
    const { id, token } = await Tokens.verify(req);
    const verify = new Verify(id, token);
    await verify.tokenFn();
    req.locals = {
      id,
    };
    return next();
  } catch (error) {
    return sendUnauthorized(res, error);
  }
};

module.exports = authorized;
