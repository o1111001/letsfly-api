const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  EXPIRES,
} = require('../../config/env');

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
    if (!token) {
      throw 'You need to login';
    }
    const { id } = await jwt.verify(token, JWT_SECRET);
    return { id, token };
  }

  static async verifyStorage(req) {
    if (req.headers && req.headers.authorization) {
      let token = req.headers.authorization;
      if (!token) {
        throw 'You need to login';
      }
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Token$/i.test(scheme)) {
          token = credentials;
          const { id } = await jwt.verify(token, JWT_SECRET);
          return { id, token };
        }
      } else {
        throw 'You need to login';
      }

    } else {
      throw 'You need to login';
    }
  }
}

module.exports = Tokens;
