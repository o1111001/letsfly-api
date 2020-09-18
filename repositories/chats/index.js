const { db } = global;
const promisify = require('../../helpers/promisify');
class Chat {
  get(id) {
    return new Promise((resolve, reject) => {
      db('chats')
        .where({
          id,
        })
        .andWhereRaw('"isDeleted" is not true')
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  getFull(link, userId) {
    return new Promise((resolve, reject) => {
      db.raw(`
      select 
      id, 
      type,
      name,
      description,
      link,
      price,
      avatar,
      (select cu."userId" from chats_users cu where cu."userId" = ? and cu."chatId" = ch.id)::boolean as "isMember",
      (select ca."adminId" from chats_admins ca where ca."adminId" = ? and ca."chatId" = ch.id)::boolean as "isAdmin",
      (select chs."endedAt" from chat_subscriptions chs where chs."userId" = ? and chs."chatId" = ch.id and chs."endedAt" > now()) as "isHasActiveSubscription",
      (select count(cu."userId")::int from chats_users cu where cu."chatId" = ch.id) as "subscribers",

      (
        case
        when ch.type = 'private'  then (
          case
          when (
            (select chs."chatId" from chat_subscriptions chs where chs."userId" = ? and chs."endedAt" > now() and chs."chatId" = ch.id )::boolean 
            or (select ca."adminId" from chats_admins ca where ca."adminId" = ? and ca."chatId" = ch.id)::boolean
            ) then (
            select coalesce(array_agg(
              json_build_object(
                'id', m.id,
                'text', m."text",
                'type', m."type",
                'attachment', (select a.path from attachments a where a.id = m."attachmentId"),
                'isPublic', m."isPublic",
                'isRead', (

                  select (
                    case
                    when m.id <= (select "messageId" from messages_is_read where "userId" != ? order by "messageId" desc limit 1)
                      then 1
                    else 0
                  end
                  )::boolean as "isRead"

                ),
                
                'senderId', m."senderId",
                'createdAt', m."createdAt"
              ) ORDER BY m."createdAt" asc
            ), '{}')
            from messages m 
            where m."chatId" = ch.id 
          ) else (
            select coalesce(array_agg(
              json_build_object(
                'id', m.id,
                'text', m."text",
                'type', m."type",
                'attachment', (select a.path from attachments a where a.id = m."attachmentId"),
                'isPublic', m."isPublic",
                'isRead', (

                  select (
                    case
                    when m.id <= (select "messageId" from messages_is_read where "userId" != ? order by "messageId" desc limit 1)
                      then 1
                    else 0
                  end
                  )::boolean as "isRead"

                ),
                'senderId', m."senderId",
                'createdAt', m."createdAt"
              ) ORDER BY m."createdAt" asc
            ), '{}')
            from messages m 
            where m."chatId" = ch.id and (m."isPublic" = true or m."senderId" = -1)
            ) end
        ) 
        when ch.type = 'public' then (
          select coalesce(array_agg(
            json_build_object(
              'id', m.id,
              'text', m."text",
              'type', m."type",
              'attachment', (select a.path from attachments a where a.id = m."attachmentId"),
              'isPublic', m."isPublic",
              'isRead', (

                select (
                  case
                  when m.id <= (select "messageId" from messages_is_read where "userId" != ? order by "messageId" desc limit 1)
                    then 1
                  else 0
                end
                )::boolean as "isRead"

              ),
              'senderId', m."senderId",
              'createdAt', m."createdAt"
              ) ORDER BY m."createdAt" asc
            ), '{}') as "messages"
          from messages m 
          where m."chatId" = ch.id
        ) else (
          select array_agg(json_build_object())
        )
      end
      ) as "messages"
      from chats ch
      where ch."link" = ?
      `,
      [userId, userId, userId, userId, userId, userId, userId, userId, link])
        .then(res => {
          resolve(res.rows[0]);
        })
        .catch(err => reject(err));
    });
  }

  async create(fields, usersList, adminId) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [chatId] = await trx('chats')
        .insert(fields)
        .returning('id');

      if (['public', 'private'].includes(fields.type)) {
        await trx('messages')
          .insert({
            senderId: -1,
            text: 'Chat has been created',
            chatId,
          });
      }

      if (usersList.length || adminId) {
        const users = await trx('users')
          .whereIn('id', adminId ? [...usersList, adminId] : usersList)
          .select('id as userId', trx.raw('? AS ??', [chatId, 'chatId']));

        await trx('chats_users')
          .insert(users);
      }

      if (adminId) {
        await trx('chats_admins')
          .insert({
            adminId,
            chatId,
          });
      }

      await trx.commit();
      return chatId;
    } catch (e) {
      console.log(e);
      await trx.rollback('Internal server error');
    }
  }

  deleteChat(id) {
    return db('chats')
      .update({ isDeleted: true })
      .where({ id });
  }

  join(fields) {
    return new Promise((resolve, reject) => {
      db('chats_users')
        .insert(fields)
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  updateAvatar(id, avatar) {
    return db('chats')
      .update({ avatar })
      .where({ id });
  }

  update(id, fields) {
    return db('chats')
      .update(fields)
      .where({ id });
  }

  isMember({ userId, chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_users')
        .where({
          userId,
          chatId,
        })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  subcribe(chatId, userId) {
    return db('chats_users')
      .insert({
        chatId,
        userId,
      });
  }


  async privateSubscribe(chatId, userId, period) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [{ price }] = await trx('chats')
        .select('price')
        .where({ id: chatId })
        .limit(1);

      const [{ balance: userBalance }] = await trx('user_balance')
        .where({ userId })
        .limit(1);

      if (userBalance < price * period) {
        throw 'Inefficient balance';
      }

      const [{ adminId }] = await trx('chats_admins')
        .select('adminId')
        .where({ chatId })
        .limit(1);

      const { rows: [{ userPaid, adminGet, endedAt }] } = await trx
        .raw(`
          insert into chat_subscriptions 
          ("userId", "chatId", "amount", "createdAt", "endedAt")
          values
          (?, ?, ?, now(), now() + (interval '30 days') * ?)
          returning amount as "userPaid", amount / 2 as "adminGet", "endedAt"
        `, [userId, chatId, period * price, period]);

      await trx('user_balance')
        .where({ userId: adminId })
        .increment({
          balance: adminGet,
        });

      await trx('user_balance')
        .where({ userId })
        .decrement({
          balance: userPaid,
        });

      await trx.commit();
      return { chatId, endedAt };
    } catch (e) {
      console.log(e);
      await trx.rollback('Internal server error');
    }
  }
  leave(chatId, userId) {
    return db('chats_users')
      .where({
        chatId,
        userId,
      })
      .del();
  }
  declineInvite(chatId, invitedUserId) {
    return db('invitations_for_subscription')
      .where({
        chatId,
        invitedUserId,
      })
      .del();
  }
  getMembers({ chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_users')
        .where({
          chatId,
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }



  countUnReadMessagesInChat({ chatId, userId }) {
    return new Promise((resolve, reject) => {
      db.raw(`
        select count(*)::int as "count" from messages pm
        where 
        pm."chatId" = ? 
        and pm.id > (
          select max(m.id)
          from messages m
          left join messages_is_read mir on m.id = mir."messageId" and mir."userId" = ?
          where 
          m."chatId" = pm."chatId"
          and  mir."isRead" is true
          group by m.id
          order by m.id desc 
          limit 1
        )
      `,
      [chatId, userId])
        .then(res => resolve(res.rows[0]))
        .catch(err => reject(err));
    });
  }

  countAttachmentsInChat(type, details) {
    const personal = ({ senderId, receiverId }) => db.raw(
      `
        select a."type" 
        from chats ch
        left join messages m on m."chatId" = ch.id
        left join attachments a on a.id = m."attachmentId"
        where ch.id = (
          select "chatId" from chats_users cu
          left join chats ch on ch.id = cu."chatId"
          where cu."userId" in (?, ?) and ch.type = 'personal'
          group by cu."chatId"
          having count(cu."userId") = 2
        ) and attachment is not null
      `,
      [senderId, receiverId],
    );

    const publicChat = ({ chatId }) => db.raw(
      `
        select a."type" 
        from chats ch
        left join messages m on m."chatId" = ch.id
        left join attachments a on a.id = m."attachmentId"
        where ch.id = ? and attachment is not null
      `,
      [chatId],
    );

    const privateChat = ({ chatId, userId }) => db.raw(
      `
        select a."type" 
        from chats ch
        left join messages m on m."chatId" = ch.id
        left join attachments a on a.id = m."attachmentId"
        where ch.id = ? 
        and m."isPublic" != (select "chatId" from chat_subscriptions cs where cs."chatId" = ch.id and cs."userId" = ?)::boolean
        and attachment is not null
      `,
      [chatId, userId],
    );

    const defineSubquery = {
      personal: personal(details),
      public: publicChat(details),
      private: privateChat(details),

    };

    return new Promise((resolve, reject) => {
      db.raw(
        `with files as (?) select 
        (select count(type)::int as "photo" from files where type = 'photo'),
        (select count(type)::int as "video" from files where type = 'video'),
        (select count(type)::int as "audio" from files where type = 'audio'),
        (select count(type)::int as "audio_message" from files where type = 'audio_message'),
        (select count(type)::int as "file" from files where type = 'another')
        `,
        [defineSubquery[type]],
      )
        .then(result => resolve(result.rows[0]))
        .catch(err => reject(err));
    });
  }



  readMessages(type, details) {
    const personal = ({ userId, chatId }) => db.raw(
      `
      select 
        ?,
        m.id,
        true
      from messages m
      where m."senderId" != ? and m."chatId" = ?
      order by m."createdAt" desc limit 1
      `,
      [userId, userId, chatId],
    );

    const defineSubquery = {
      personal: personal(details),
    };

    return new Promise((resolve, reject) => {
      db.raw(
        `
        insert into messages_is_read ("userId", "messageId", "isRead") ?
        `,
        [defineSubquery[type]],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  getFilesFromChat(type, fileType, details) {
    const personal = ({ user1, user2 }) => db.raw(
      `
      select "chatId" from chats_users cu
      left join chats ch on ch.id = cu."chatId"
      where cu."userId" in (?, ?) and ch.type = 'personal'
      group by cu."chatId"
      having count(cu."userId") = 2
      `,
      [user1, user2],
    );

    const defineSubquery = {
      personal: personal(details),
    };

    return new Promise((resolve, reject) => {
      db.raw(
        `select 
          a.id, 
          a.type, 
          a."createdAt", 
          a.path,
          (select pm."senderId" from messages pm where pm."attachmentId" = a.id)
        from "attachments" a
        where "id" in (
          select "attachmentId"
          from "messages" 
          where "chatId" = (?)
        ) and "type" = ?
        order by a."createdAt" desc`,
        [defineSubquery[type], fileType],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  addAdmin({ adminId, chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_admins')
        .insert({
          adminId,
          chatId,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  isAdmin({ adminId, chatId }) {
    return new Promise((resolve, reject) => {
      db('chats_admins')
        .where({
          adminId,
          chatId,
        })
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  getAdmins(chatId) {
    return db('chats_admins')
      .where({
        chatId,
      });
  }

  getSubscribers(chatId) {
    return new Promise((resolve, reject) => {
      db
        .raw(`
        select 
        coalesce(array_agg(cs."userId"), '{}') as "users"
        from chats_users  cs
        where cs."chatId" = ?
      `, [chatId])
        .then(result => resolve(result.rows[0].users))
        .catch(err => reject(err));
    });
  }

  getPrivateSubscribers(chatId) {
    return new Promise((resolve, reject) => {
      db
        .raw(`
        select
        coalesce(array_agg(cs."userId"), '{}') as "users"
        from chat_subscriptions cs
        where cs."chatId" = ? and cs."endedAt" > now()
      `, [chatId])
        .then(result => resolve(result.rows[0].users))
        .catch(err => reject(err));
    });
  }

  getContactsInChat({ chatId, userId }) {
    return new Promise((resolve, reject) => {
      db.raw(`
      select 
        c."userId",
        c."displayedFirstName",
        c."displayedLastName",
        cu."userId"::boolean as "isMember"
      from contacts c
      left join chats_users cu on cu."userId" = c.contact and cu."chatId" = ?
      where c."userId" = ?
    `, [chatId, userId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  getContactsForNewChat({ userId, link }) {
    return new Promise((resolve, reject) => {
      db.raw(`
      select
        c."contact" as "id",
        c."displayedFirstName",
        c."displayedLastName",
        cu."userId"::boolean as "isAlreadyMember"
      from contacts c 
      left join chats_users cu 
        on cu."chatId" = (
          select id from chats where link = ?
        )
        and cu."userId" = c.contact 
      where c."userId" = ?
    `, [link, userId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }


  isFreeLink({ id, link }) {
    return new Promise((resolve, reject) => {
      db('chats')
        .where({
          link,
        })
        .andWhereNot({
          id,
        })
        .then(result => resolve(!result.length))
        .catch(err => reject(err));
    });
  }

  activeSubscriptions(chatId) {
    return db('chats_subscriptions')
      .where({ chatId })
      .andWhere('endedAt', '<', Date.now());
  }

  async createInvites(chatId, usersList) {
    return db('invitations_for_subscription')
      .insert(
        await db('users')
          .whereIn('id', usersList)
          .select('id as userId', db.raw('? AS ??', [chatId, 'chatId'])),
      );
  }

  async joinUsers({ link, usersList }) {
    const [{ id: chatId }] = await db('chats')
      .where({ link })
      .select('id');
    const [{ users: duplicatedUsers }] = await db('chats_users')
      .where({ chatId })
      .select(db.raw('ARRAY_AGG("userId") as users'));
    return db('chats_users')
      .insert(
        await db('users')
          .whereIn('id', usersList)
          .andWhere('id', 'not in', duplicatedUsers)
          .select('id as userId', db.raw('? AS ??', [chatId, 'chatId'])),
      );
  }

  getAll({ userId }) {
    return new Promise((resolve, reject) => {
      db.raw(
        `select
        pm."chatId",
        pm."text",
        pm."createdAt",
        pm."type",
        pm."attachment",
        pm."senderId",
        ch."type" as "chatType",
        (
          case
          when ch.type = 'personal'
            then (
              select json_build_object(
		          'id', u1.id,
		          'username',  u1."username",
		          'firstName',  u1."firstName",
		          'lastName',  u1."lastName",
		          'email',  u1."email",
		          'phone',  u1."phone",
		          'about',  u1."about",
		          'avatar',  u1."avatar",
		          'isOnline',  u1."isOnline",
		          'lastOnline',  u1."lastOnline",
		          'displayedName', (select concat(c."displayedFirstName", ' ', c."displayedLastName") from contacts c where (c."userId" = ? and c.contact = u1.id) )
	          ) as "info" from users u1 where id = (
	          	select cu."userId" from chats_users cu where cu."chatId" = pm."chatId" and cu."userId" != ?
	          )	
          	)
          	when ch.type = 'public'
          	then (
          	  select json_build_object(
          		'id', ch.id,
              'name', ch."name",
              'type', ch."type",
              'description', ch."description",
              'link', ch."link",
              'price', ch."price",
              'avatar', ch."avatar"
	          ) as "info" from chats ch where id = pm."chatId"	
            )
            when ch.type = 'private'
          	then (
          	  select json_build_object(
          		'id', ch.id,
              'name', ch."name",
              'type', ch."type",
              'description', ch."description",
              'link', ch."link",
              'price', ch."price",
              'avatar', ch."avatar"
	          ) as "info" from chats ch where id = pm."chatId"
          	)
          end
        ) as opponent,

        (
          select count(*)::int as "count" from messages m
          where 
          m."chatId" = pm."chatId" 
          and m."senderId" != ?
          and m.id > (
            select m.id
            from messages m
            left join messages_is_read mir on m.id = mir."messageId" and mir."userId" = ?
            where 
            m."chatId" = pm."chatId"
            and  mir."isRead" is true
            order by m.id desc
            limit 1
          )
        )
        from messages pm
        inner join chats ch on ch.id = pm."chatId"

        where pm.id in (
        select coalesce(
          max(mr."messageId"), 
          (select max("unread_chat"."id") from (select mq.id from messages mq where mq."chatId" = m."chatId" and (
            (select chs."chatId" from chat_subscriptions chs where chs."userId" = ? and chs."endedAt" > now())::boolean 
            or (select ca."adminId" from chats_admins ca where ca."chatId" = m."chatId" and ca."adminId" = ?) :: boolean
            or (mq."isPublic" = true or mq."senderId" = -1 )

          ) order by mq.id desc) as "unread_chat"),
          0
        ) as "unread" from messages_is_read mr
          right join messages m on m.id = mr."messageId"
          right join chats_users cu on cu."chatId" = m."chatId"
          where cu."userId" = ?
          group by m."chatId"
        )
        order by pm."createdAt" desc                                                                                                                                                                                                                                                                                                                                              
        `,
        [userId, userId, userId, userId, userId, userId, userId],
      )
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }


}


module.exports = new Chat();
