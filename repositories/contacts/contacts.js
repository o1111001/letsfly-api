const { db } = global;
const { CustomError } = require('../../helpers/errors');

class Contacts {
  constructor(userId, contact, displayedName) {
    this.userId = userId;
    this.contact = contact;
    this.displayedName = displayedName;
  }

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
          return reject(new CustomError('Contact is not defined', 422));
        })
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
