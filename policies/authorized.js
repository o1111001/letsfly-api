const Tokens = require('../helpers/tokens');
const { verify: Verify } = require('../repositories');
const { sendError } = require('../helpers/responses');


const authorized = async (req, res, next) => {
  try {
    const { id, token } = await Tokens.verify(req);
    const verify = new Verify(id, token);
    await verify.tokenFn();
    return next();
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = authorized;
