const { db } = global;

class Bio {
  constructor(id) {
    this.id = id;
  }
  get(me) {
    const { id } = this;
    return new Promise((resolve, reject) => {
      db.raw(`SELECT "u"."id", "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", (select "c"."userId"::boolean from contacts c where "c"."userId" = ? and "c"."contact" = ?) as "contact" FROM users u WHERE "u"."id" = ?`, [me, id, id])
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
}

module.exports = Bio;
