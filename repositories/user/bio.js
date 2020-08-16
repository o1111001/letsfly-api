const { db } = global;

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
        (select "b"."balance" from user_balance b where "b"."userId" = ?) as "balance"
        FROM users u WHERE "u"."id" = ?`,
        [me, id, me, me, id])
        .then(result => {
          if (result.rows.length) return resolve(result.rows[0]);
          return reject('User does not exist');
        })
        .catch(err => reject(err));

    });
  }

  getUser(me) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db.raw(`SELECT 
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
      "c"."displayedFirstName",
      "c"."displayedLastName"

      FROM users u 
      inner join "contacts" "c" on "c"."contact" = "u"."id"
      WHERE "u"."id" = ? and "c"."userId" = ?`,
      [id, me])
        .then(result => {
          if (result.rows.length) return resolve(result.rows[0]);
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
    return new Promise((resolve, reject) => {
      db('users')
        .where({ id })
        .update({ firstName, lastName, phone, username, about })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}

module.exports = Bio;
