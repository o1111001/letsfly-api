const { db } = global;

class SignUp {
  constructor(email) {
    this.email = email;
  }
  checkExists() {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .then(result => {
          if (result.length) return reject('Email is already in use');
          return resolve();
        })
        .catch(err => reject(err));
    });
  }

  create() {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .insert({
          email,
          createdAt: db.fn.now(6),
          updatedAt: db.fn.now(6),
        })
        .then(res => resolve(res))
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
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

}

module.exports = SignUp;
