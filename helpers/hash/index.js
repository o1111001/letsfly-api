const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../../config/env');
const { CustomError } = require('../../helpers/errors');

class Hash {
  static async generate(code) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(code, salt);
    return hash;
  }

  static compare(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, match) => {
        if (err) reject(err);
        if (!match) return reject(new CustomError('Wrong credentials', 409));
        return resolve(true);
      });
    });
  }
}

module.exports = Hash;
