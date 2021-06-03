const { db } = global;
const { CustomError } = require('../../../helpers/errors');

class Bio {
  constructor(id) {
    this.id = id;
  }
  get(me) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db.raw(
        `SELECT "u"."id"::int, "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", "u"."isOnline", "u"."lastOnline", 
        (select "c"."userId"::boolean from contacts c where "c"."userId" = ? and "c"."contact" = ?) as "contact",
        (select "a"."userId"::boolean from admins a where "a"."userId" = ?) as "isAdmin",
        (select "b"."balance"::numeric -  (select coalesce(sum(w.amount), 0) as "waitWithdraw" from withdrawals w where w."userId" = ? and w.status = 'requested' ) from user_balance b where "b"."userId" = ?) as "balance",
        (select coalesce(sum(w.amount), 0) as "waitWithdraw" from withdrawals w where w."userId" = ? and w.status = 'requested' )

        FROM users u WHERE "u"."id" = ?`,
        [me, id, me, me, me, me, id])
        .then(result => {
          if (result.rows.length) return resolve(result.rows[0]);
          return reject('User does not exist');
        })
        .catch(err => reject(err));

    });
  }

  getUser({ id, me }) {
    return new Promise((resolve, reject) => {
      db.raw(`
      SELECT 
      "u"."id"::int, 
      "u"."username", 
      "u"."firstName", 
      "u"."lastName", 
      "u"."email", 
      "u"."phone", 
      "u"."about", 
      "u"."avatar", 
      "u"."isOnline", 
      "u"."lastOnline",
      (select c."displayedFirstName" from contacts c where c.contact = u.id and c."userId" = ?),
      (select c."displayedLastName" from contacts c where c.contact = u.id and c."userId" = ?),
      (select concat(c."displayedFirstName", ' ', c."displayedLastName") as "displayedName" from contacts c where (c."userId" = ? and c.contact = u.id) )

      FROM users u
      where u.id = ?
      `,
      [+me, +me, +me, +id])
        .then(result => {
          if (result.rows.length) return resolve(result.rows[0]);
          return reject(new CustomError('User does not exist', 422));
        })
        .catch(err => reject(err));

    });
  }

  updateUsername(username) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ username }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updatePhoneNumber(phone) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ phone }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateFirstName(firstName) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ firstName }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateLastName(lastName) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ lastName }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateAbout(about) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ about }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  updateAvatar(avatar) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ avatar }, ['username', 'firstName', 'lastName', 'email', 'phone', 'about', 'avatar'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
  checkUsername(username) {
    const { id } = this;
    if (!username) return false;

    return new Promise((resolve, reject) => {
      db('users')
        .where({ username })
        .andWhereNot({ id })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  checkPhone(phone) {
    const { id } = this;
    if (!phone) return false;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ phone })
        .andWhereNot({ id })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
  updateFullBio({ firstName, lastName, phone, username, about }) {
    const { id } = this;

    const data = {
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
      username: username || null,
      about: about || null,
    };

    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update(data)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

module.exports = Bio;
