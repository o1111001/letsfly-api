const jwt = require('jsonwebtoken');
const {
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  EXPIRES_ACCESS,
  EXPIRES_REFRESH,
} = require('../../config/env');
const {
  getUserOfAccessToken,
  getUserOfRefreshToken,
} = require('../../repositories/auth/policies');

const { CustomError } = require('../errors');

class Tokens {
  static generate(id) {
    const expirationAccess = Number(new Date()) + EXPIRES_ACCESS;
    const expirationRefresh = Number(new Date()) + EXPIRES_REFRESH;

    const access = jwt.sign({
      exp: expirationAccess,
      id,
    }, JWT_SECRET_ACCESS);

    const refresh = jwt.sign({
      exp: expirationRefresh,
      id,
    }, JWT_SECRET_REFRESH);

    return { access, refresh, expirationAccess };
  }

  static async verify(req) {
    const token = req.cookies.token || '';
    if (!token) throw new CustomError('Unauthorized', 403);
    const { id } = await jwt.verify(token, JWT_SECRET_ACCESS);
    return { id, token };
  }

  static async verifyStorage(req) {
    if (!req.headers || !req.headers.authorization) throw new CustomError('Unauthorized', 403);
    const token = req.headers.authorization;

    if (!token) throw new CustomError('Unauthorized', 403);
    const parts = req.headers.authorization.split(' ');

    if (parts.length !== 2) throw new CustomError('Unauthorized', 403);
    const [scheme, credentials] = parts;

    if (!credentials || credentials === 'null') throw new CustomError('Unauthorized', 403);
    if (scheme === 'Token') {
      const { id } = await jwt.verify(credentials, JWT_SECRET_ACCESS);
      const tokenData = await getUserOfAccessToken(credentials);
      if (!tokenData || !tokenData.length) {
        throw new CustomError('Unauthorized', 403);
      }
      const [{ userId: userIdFromDB }] = tokenData;
      if (userIdFromDB !== id) {
        throw new CustomError('Unauthorized', 403);
      }
      return { id, token: credentials };
    }
  }

  static async verifyRefreshToken(req) {
    if (!req.cookies || !req.cookies.refresh) throw new CustomError('Unauthorized', 422);
    const token = req.cookies.refresh;
    const { id } = await jwt.verify(token, JWT_SECRET_REFRESH);

    const tokenData = await getUserOfRefreshToken(token);
    if (!tokenData || !tokenData.length) {
      throw new CustomError('Unauthorized', 403);
    }
    const [{ userId: userIdFromDB }] = tokenData;

    if (userIdFromDB !== id) {
      throw new CustomError('Unauthorized', 403);
    }
    return { id, token };
  }

  static async verifySocket(socket) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const { token } = socket.handshake.query;
      const { id } = await jwt.verify(token, JWT_SECRET_ACCESS);
      return { id, token };
    } throw new CustomError('Unauthorized', 403);
  }
}

module.exports = Tokens;
