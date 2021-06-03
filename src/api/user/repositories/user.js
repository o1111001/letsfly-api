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
        ` with selected_chats as (
          select 
          c.id,
          c."link",
          array_agg(cmu."userId") as "users",
          (select count(distinct cmu."userId")) as "description",
          c.avatar,
          c."name",
          'group' as "type"
          from chats c
          join chats_memberships cm on cm."chatId" = c.id
          join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
          where 
          lower(c."name") like ?
          and c."isDeleted" != true
          group by c.id
        ) select * from selected_chats sc WHERE NOT (? = ANY (sc."users")) limit 10
        
        
        `,
        [displayedNameRegex, id])
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }
  findGlobalUsername(id, name) {
    const displayedNameRegex = name ? `${name}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.raw(
        `with selected_chats as (
          select 
          c.id,
          c."link",
          array_agg(cmu."userId") as "users",
          (select count(distinct cmu."userId")) as "description",
          c.avatar,
          c."name",
          'group' as "type"
          from chats c
          join chats_memberships cm on cm."chatId" = c.id
          join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
          where 
          c."link" like ?
          and c."isDeleted" != true
          group by c.id
        ) select  
        sc.id,
        sc."link",
        sc."description",
        sc.avatar,
        sc."name",
        sc."type"
        from selected_chats sc WHERE NOT (? = ANY (sc."users")) limit 10`,
        [displayedNameRegex, id])
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = User;
