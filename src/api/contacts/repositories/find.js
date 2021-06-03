const { db } = global;

class ContactsFind {

  // search
  findActive(id, name) {
    const nameRegex = name ? `${name}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.raw(
        `
        SELECT 
        "u"."id", 
        "u"."username" as "link", 
        "u"."avatar", 
        concat(c."displayedFirstName", ' ', c."displayedLastName") as "name",
        (
          case 
            when u."isOnline" = true then 'true'::varchar(255)
            else u."lastOnline"::varchar(255) 
          end
        ) as "description",
        'personal' as "type"
        FROM users u 
        left join contacts c on c."contact" = u."id"
        WHERE "c"."userId" = ? 
        and lower(concat(c."displayedFirstName", ' ', c."displayedLastName")) like ?
        and u.id != ?

      union 
        select 
        c.id,
        c."link",
        c.avatar,
        c."name",
        (
          select count(distinct cmu2."userId") from chats_memberships cm2 
          join chats_memberships_users cmu2 on cmu2."chatMembershipId" = cm2.id
          where cm2."chatId" = c.id
        
        )::varchar(255) as "description",
        'group' as "type"
        from chats c
        join chats_memberships cm on cm."chatId" = c.id
        join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id 
        where lower(c."name") like ?
        and cmu."userId" = ?
        and cmu."endedAt" > now()
        and c."isDeleted" != true
        group by c.id
        
        `,
        [id, nameRegex, id, nameRegex, id])
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }








  findUsername(id, username) {
    const usernameRegex = username ? `${username}%`.toLowerCase() : '%';
    return new Promise((resolve, reject) => {
      db.raw(
        `
        with selected_chats as (
          select 
          c.id,
          c."link",
          array_agg(cmu."userId") as "users",
          c.avatar as "avatar",
          (
            select count(distinct cmu2."userId")::varchar(255) from chats_memberships cm2 
            join chats_memberships_users cmu2 on cmu2."chatMembershipId" = cm2.id
            where cm2."chatId" = c.id
          
          ) as "description",
          
          c."name",
          'group' as "type"
          from chats c
          join chats_memberships cm on cm."chatId" = c.id
          join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id and cmu."userId" = ?
          where 
          c."link" like ?
          and c."isDeleted" != true
          group by c.id
        ) 
        select 
          "u"."id", 
          "u"."username" as "link",
          "u"."avatar", 
          (
            case 
              when u."isOnline" = true then 'true'::varchar(255)
              else u."lastOnline"::varchar(255) 
            end
          ) as "description",
          concat(c."displayedFirstName", ' ', c."displayedLastName") as "name",
          'personal' as "type"
          FROM users u 
          left join contacts c on c."contact" = u."id"
          WHERE "c"."userId" = ? and u."username" like ? 
          and u.id != ?

        union 

          select 
          sc.id,
          sc."link",
          sc."avatar",

          sc."description",
          sc."name",
          sc."type"
          from selected_chats sc limit 10
        
        `,
        [id, usernameRegex, id, usernameRegex, id])
        .then(result => {
          resolve(result.rows);
        })
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
            and u.id != ?
            order by u."isOnline" desc, u."lastOnline" desc`,
        [id, displayedNameRegex, id])
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


}

module.exports = new ContactsFind();
