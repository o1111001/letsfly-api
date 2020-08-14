const { db } = global;

class Contacts {
  constructor(userId, contact, displayedName) {
    this.userId = userId;
    this.contact = contact;
    this.displayedName = displayedName;
  }

  // getAllOld() {
  //   const { userId } = this;
  //   return new Promise((resolve, reject) => {
  //     db.select('users.id', 'username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar', 'isOnline', 'lastOnline', `concat(displayedFirstName, ' ', displayedFirstName)`)
  //       .from('users')
  //       .leftOuterJoin('contacts', 'contacts.contact', 'users.id')
  //       .where({
  //         userId,
  //       })
  //       .then(result => resolve(result))
  //       .catch(err => reject(err));
  //   });
  // }

  getAll() {
    const { userId } = this;
    return new Promise((resolve, reject) => {
      db.raw(
        `SELECT "u"."id", "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", "u"."isOnline", "u"."lastOnline", concat(c."displayedFirstName", ' ', c."displayedLastName") as "displayedName"
        FROM users u 
        left join contacts c on c."contact" = u."id"
        WHERE "c"."userId" = ?
        order by u."isOnline" desc, u."lastOnline" desc`,
        [userId])
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  add(displayedFirstName, displayedLastName) {
    const { userId, contact } = this;
    return new Promise((resolve, reject) => {
      db('contacts')
        .insert({
          userId,
          contact,
          displayedFirstName,
          displayedLastName,
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
      db.raw(
        `SELECT "u"."id", "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", "u"."isOnline", "u"."lastOnline", concat(c."displayedFirstName", ' ', c."displayedLastName") as "displayedName"
              FROM users u 
              left join contacts c on c."contact" = u."id"
              WHERE "c"."userId" = ? and u."username" like ? 
              order by u."isOnline" desc, u."lastOnline" desc`,
        [id, usernameRegex])
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  findDisplayedName(id, displayedName) {
    const displayedNameRegex = displayedName ? `${displayedName}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.raw(
        `SELECT "u"."id", "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", "u"."isOnline", "u"."lastOnline", concat(c."displayedFirstName", ' ', c."displayedLastName") as "displayedName"
            FROM users u 
            left join contacts c on c."contact" = u."id"
            WHERE "c"."userId" = ? and lower(concat(c."displayedFirstName", ' ', c."displayedLastName")) like ? 
            order by u."isOnline" desc, u."lastOnline" desc`,
        [id, displayedNameRegex])
        .then(result => resolve(result.rows))
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


  updateDisplayedName(id, displayedFirstName, displayedLastName, userId) {
    return new Promise((resolve, reject) => {
      db('contacts')
        .where({
          userId: id,
          contact: userId,
        })
        .update({
          displayedFirstName,
          displayedLastName,
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

}

module.exports = Contacts;
