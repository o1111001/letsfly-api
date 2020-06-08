const Tokens = require('../helpers/tokens');
const { verify: Verify } = require('../repositories');

const authorizedSocket = async (socket, next) => {
  try {
    const { id, token } = await Tokens.verifySocket(socket);
    const verify = new Verify(id, token);
    await verify.tokenFn();
    socket.userId = id;
    return next();
  } catch (error) {
    return next(new Error('You need to login'));
  }
};

module.exports = authorizedSocket;
