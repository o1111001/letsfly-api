const { db } = global;

class Admin {
  constructor(email, hash) {
    this.email = email;
    this.hash = hash;
  }
  check(userId) {
    return new Promise((resolve, reject) => {
      db('admins')
        .where({ userId })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject('Wrong');
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = Admin;
