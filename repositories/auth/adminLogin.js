const { db } = global;
const { CustomError } = require('../../helpers/errors');

class AdminLogin {
  constructor(id) {
    this.id = id;
  }
  check() {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('admins')
        .where({
          userId: id,
        })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject(new CustomError('Admin does not exist', 403));
        })
        .catch(err => reject(err));
    });
  }

  addToken(token) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('admins')
        .update({
          token,
        })
        .where({
          userId: id,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }
}

module.exports = AdminLogin;
