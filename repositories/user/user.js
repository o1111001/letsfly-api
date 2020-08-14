const { db } = global;

class User {
  constructor(user, bannedUser) {
    this.user = user;
    this.bannedUser = bannedUser;
  }

  ban() {
    const { user, bannedUser } = this;
    return new Promise((resolve, reject) => {
      db('banned_users')
        .insert({
          user,
          bannedUser,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  unBan() {
    const { user, bannedUser } = this;
    return new Promise((resolve, reject) => {
      db('banned_users')
        .where({
          user,
          bannedUser,
        })
        .del()
        .returning(['user', 'bannedUser'])
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
  checkBans() {
    const { user, bannedUser } = this;
    return new Promise((resolve, reject) => {
      db.raw(`select 
        (select "bannedUser"::boolean from "banned_users" where "user" = ?? and "bannedUser" = ?? ) as "isBanned", 
        (select "bannedUser"::boolean from "banned_users" where "bannedUser" = ?? and "user" = ?? ) as "inBan"
        `, [+user, +bannedUser, +user, +bannedUser])
        .then(res => resolve(res.rows[0]))
        .catch(err => reject(err));
    });
  }

  findGlobalName(id, name) {
    const displayedNameRegex = name ? `${name}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.raw(
        `SELECT "u"."id", "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", "u"."isOnline", "u"."lastOnline"
            FROM users u
            where u.id not in (
              select c.contact from contacts c where c."userId" = ?
            )
            and lower(concat("u"."firstName", ' ', "u"."lastName")) like ? 
            order by u."isOnline" desc, u."lastOnline" desc`,
        [id, displayedNameRegex])
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }
  findGlobalUsername(id, name) {
    const displayedNameRegex = name ? `${name}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.raw(
        `SELECT "u"."id", "u"."username", "u"."firstName", "u"."lastName", "u"."email", "u"."phone", "u"."about", "u"."avatar", "u"."isOnline", "u"."lastOnline"
            FROM users u
            where u.id not in (
              select c.contact from contacts c where c."userId" = ?
            )
            and u.username like ? 
            order by u."isOnline" desc, u."lastOnline" desc`,
        [id, displayedNameRegex])
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }
}

module.exports = User;
