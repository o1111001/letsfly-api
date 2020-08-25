const { db } = global;

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

  async create(fields, usersList, adminId) {
    const promisify = fn => new Promise(resolve => fn(resolve));
    const trx = await promisify(db.transaction.bind(db));

    try {
      const [chatId] = await trx('chats')
        .insert(fields)
        .returning('id');

      if (usersList.length) {
        await trx('chats_users')
          .insert(
            await trx('users')
              .whereIn('id', usersList)
              .select('id as userId', trx.raw('? AS ??', [chatId, 'chatId'])),
          );
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

    const defineSubquery = {
      personal: personal(details),
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
    return db('chats_users')
      .where({
        chatId,
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
        	select 
        	
        	(
	           case
	            when ch.type = 'personal'
	              then "opponent"."info"
	        	
         	   end
          	) as "opponent"
        	
        	 from (
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
	        	) as "info" from users u1 where id = (select cu."userId" from chats_users cu where cu."chatId" = pm."chatId" and cu."userId" != ?)	
        	) as "opponent"
        ),
 
        (
          select count(*)::int as "count" from messages m
          where 
          m."chatId" = pm."chatId" 
          and m.id > (
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
        )
        from messages pm
        inner join chats ch on ch.id = pm."chatId"

        where pm.id in (
        select coalesce(
          max(mr."messageId"), 
          (select max("unread_chat"."id") from (select mq.id from messages mq where mq."chatId" = m."chatId" order by mq.id desc) as "unread_chat")
        ) as "unread" from messages_is_read mr
          right join messages m on m.id = mr."messageId"
          right join chats_users cu on cu."chatId" = m."chatId"
          where cu."userId" = ?
          group by m."chatId"
        )
        order by pm."createdAt" desc
        `,
        [userId, userId, userId, userId],
      )
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }


}


module.exports = new Chat();
