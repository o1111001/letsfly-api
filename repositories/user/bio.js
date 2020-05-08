const { db } = global;

class Bio {
  constructor(id) {
    this.id = id;
  }
  get() {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db.select('username', 'firstName', 'lastName', 'email', 'phone', 'about')
        .from('users')
        .where({
          id,
        })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject('User does not exist');
        })
        .catch(err => reject(err));
    });
  }

  updateUsername(username) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ username }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updatePhoneNumber(phone) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ phone }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateFirstName(firstName) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ firstName }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateLastName(lastName) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ lastName }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateAbout(about) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ about }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

module.exports = Bio;
