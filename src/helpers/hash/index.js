const crypto = require('crypto');
class Hash {
  static async generate(code) {
    const salt = crypto.randomBytes(128).toString('base64');
    const hash = await crypto.hash(code, salt);
    return hash;
  }

  static compare(password, hash) {
    return new Promise((resolve, reject) => {
      crypto.compare(password, hash, (err, match) => {
        if (err) reject(err);
        if (!match) return resolve(false);
        return resolve(true);
      });
    });
  }
}

module.exports = Hash;
