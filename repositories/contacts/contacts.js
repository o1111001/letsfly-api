const { db } = global;

class Contacts {
  constructor(userId, contact, displayedName) {
    this.userId = userId;
    this.contact = contact;
    this.displayedName = displayedName;
  }

  getAll() {
    const { userId } = this;
    return new Promise((resolve, reject) => {
      db.select('users.id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar', 'isOnline', 'lastOnline', 'displayedName')
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
    const { userId, contact, displayedName } = this;
    return new Promise((resolve, reject) => {
      db('contacts')
        .insert({
          userId,
          contact,
          displayedName,
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
  findUsername(id, username) {
    const usernameRegex = username ? `${username}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.select('users.id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar', 'isOnline', 'lastOnline', 'displayedName')
        // .distinct('users.id')
        .from('users')
        .join('contacts', 'contacts.contact', 'users.id')
        .whereRaw('users.id != ? and username like ?', [id, usernameRegex])
        .whereRaw('"displayedName" is not null', [])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  findDisplayedName(id, displayedName) {
    const displayedNameRegex = displayedName ? `${displayedName}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.select('users.id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar', 'isOnline', 'lastOnline', 'displayedName')
        // .distinct('users.id')
        .from('users')
        .join('contacts', 'contacts.contact', 'users.id')
        .whereRaw('users.id != ? and "displayedName" like ?', [id, displayedNameRegex])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  findEmail(id, email) {
    const emailRegex = `${email}%`.toLowerCase();
    return new Promise((resolve, reject) => {
      db.select('id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar')
        .from('users')
        .whereRaw('id != ? and email like ?', [id, emailRegex])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  findFullCompareEmail(id, email) {
    return new Promise((resolve, reject) => {
      db.select('id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar')
        .from('users')
        .whereRaw('id != ? and email = ?', [id, email])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  findFullname(id, fullname) {
    const fullnameRegex = `${fullname}%`.toLowerCase();
    return new Promise((resolve, reject) => {
      db.select('id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar')
        .from('users')
        .whereRaw(`id != ? and concat_ws(' ', "firstName", "lastName") like ?`, [id, fullnameRegex])
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }


  updateDisplayedName(id, displayedName, userId) {
    return new Promise((resolve, reject) => {
      db('contacts')
        .where({
          userId: id,
          contact: userId,
        })
        .update({
          displayedName,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

}

module.exports = Contacts;
