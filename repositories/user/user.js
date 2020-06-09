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
}

module.exports = User;
