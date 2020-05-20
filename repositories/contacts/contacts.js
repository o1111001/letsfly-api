const { db } = global;

class Contacts {
  constructor(userId, contact) {
    this.userId = userId;
    this.contact = contact;
  }

  getAll() {
    const { userId } = this;
    return new Promise((resolve, reject) => {
      db.select('id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar')
        .from('users')
        .leftOuterJoin('contacts', 'contacts.contact', 'users.id')
        .where({
          userId,
        })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  add() {
    const { userId, contact } = this;
    return new Promise((resolve, reject) => {
      db('contacts')
        .insert({
          userId,
          contact,
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  delete() {
    const { userId, contact } = this;
    return new Promise((resolve, reject) => {
      db('contacts')
        .where({
          userId,
          contact,
        })
        .del(['contact'])
        .then(res => {
          if (res.length) return resolve(res[0]);
          return reject('Contact is not defined');
        })
        .catch(err => reject(err));
    });
  }
  findUsername(username) {
    const usernameRegex = `${username}%`.toLowerCase();
    return new Promise((resolve, reject) => {
      db.select('id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar')
        .from('users')
        .whereRaw('username like ?', [usernameRegex])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
  findFullname(fullname) {
    const fullnameRegex = `${fullname}%`.toLowerCase();
    return new Promise((resolve, reject) => {
      db.select('id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar')
        .from('users')
        .whereRaw(`concat_ws(' ', "firstName", "lastName") like ?`, [fullnameRegex])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
}

module.exports = Contacts;
