const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  EXPIRES,
} = require('../../config/env');

const { CustomError } = require('../errors');

class Tokens {
  static generate(id) {
    const expiration = EXPIRES;
    const token = jwt.sign({ id }, JWT_SECRET, {
      expiresIn: expiration,
    });
    return token;
  }

  static async verify(req) {
    const token = req.cookies.token || '';
    if (!token) throw new CustomError('Unauthorized', 403);
    const { id } = await jwt.verify(token, JWT_SECRET);
    return { id, token };
  }

  static async verifyStorage(req) {
    if (!req.headers || !req.headers.authorization) throw new CustomError('Unauthorized', 403);

    const token = req.headers.authorization;

    if (!token) throw new CustomError('Unauthorized', 403);
    const parts = req.headers.authorization.split(' ');

    if (parts.length !== 2) throw new CustomError('Unauthorized', 403);
    const scheme = parts[0];
    const credentials = parts[1];

    if (!credentials || credentials === 'null') throw new CustomError('Unauthorized', 403);
    if (/^Token$/i.test(scheme)) {
      const { id } = await jwt.verify(credentials, JWT_SECRET);
      return { id, token: credentials };
    }
  }

  static async verifySocket(socket) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const { token } = socket.handshake.query;
      const { id } = await jwt.verify(token, JWT_SECRET);
      return { id, token };
    } throw new CustomError('Unauthorized', 403);
  }
}

module.exports = Tokens;
