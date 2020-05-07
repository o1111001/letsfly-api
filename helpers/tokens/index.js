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
}

module.exports = Tokens;
