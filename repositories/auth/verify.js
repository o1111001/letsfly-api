const { db } = global;

class Verify {
  constructor(id, token) {
    this.id = id;
    this.token = token;
  }
  tokenFn() {
    const { id, token } = this;
    return new Promise((resolve, reject) => {
      db('tokens')
        .where({
          userId: id,
          token,
        })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject('Wrong credentials');
        })
        .catch(err => reject(err));
    });
  }

}

module.exports = Verify;
