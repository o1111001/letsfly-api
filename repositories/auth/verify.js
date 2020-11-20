const { db } = global;
const { CustomError } = require('../../helpers/errors');

class Verify {
  constructor(id, access) {
    this.id = id;
    this.access = access;
  }
  tokenFn() {
    const { id, access } = this;
    return new Promise((resolve, reject) => {
      db('tokens')
        .where({
          userId: id,
          access,
        })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject(new CustomError('Wrong credentials', 403));
        })
        .catch(err => reject(err));
    });
  }

}

module.exports = Verify;
