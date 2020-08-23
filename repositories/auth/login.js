const { db } = global;
const { CustomError } = require('../../helpers/errors');

class Login {
  constructor(email, hash) {
    this.email = email;
    this.hash = hash;
  }
  getUser() {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject(new CustomError('Email does not exist', 404));
        })
        .catch(err => reject(err));
    });
  }

  addCode(hash) {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .update({
          hash,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  removeCode() {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .update({
          hash: null,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  addToken(userId, token) {
    return new Promise((resolve, reject) => {
      db('tokens')
        .insert({
          userId,
          token,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }
}

module.exports = Login;
