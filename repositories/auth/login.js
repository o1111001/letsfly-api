const { db } = global;

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
          return reject('Email does not exist');
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
