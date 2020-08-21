const { db } = global;

class Chat {
  get(id) {
    return new Promise((resolve, reject) => {
      db('chats')
        .where({
          id,
        })
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  create(fields) {
    return new Promise((resolve, reject) => {
      db('chats')
        .insert(fields)
        .returning(['id'])
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  join(fields) {
    return new Promise((resolve, reject) => {
      db('chats_users')
        .insert(fields)
        .then(resolve())
        .catch(err => reject(err));
    });
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

  findIdOfPersonalChat(fields) {
    const { senderId, receiverId } = fields;
    return new Promise((resolve, reject) => {
      db.raw(`
        select "chatId" as "id" from chats_users cu
        left join chats ch on ch.id = cu."chatId"
        where cu."userId" in (?, ?) and ch.type = 'personal'
        group by cu."chatId"
        having count(cu."userId") = 2
      `,
      [senderId, receiverId])
        .then(result => resolve(result.rows[0].id))
        .catch(err => reject(err));
    });
  }


  getPersonalChatByUserId({ senderId, receiverId }) {
    return new Promise((resolve, reject) => {
      db.raw(
        `
        with messages_list as (
          select 
          m.id,
          ch.id as "chatId",
          m.text,
          m."attachmentId",
          m."createdAt",
          m."senderId",
          m."type",
          (
            case
            when m.id <= (select "messageId" from messages_is_read where "userId" != ? order by "messageId" desc limit 1)
              then 1
            else 0
          end
          )::boolean as "isRead"

          from "chats" ch
          inner join "messages" m on m."chatId" = "ch"."id"
          where "ch"."id" = (
            select "chatId" from chats_users cu
            left join chats ch on ch.id = cu."chatId"
            where cu."userId" in (?, ?) and ch.type = 'personal'
            group by cu."chatId"
            having count(cu."userId") = 2
          ) and m."isDeleted" != true
          order by "createdAt" desc limit 30
        ) select * from messages_list order by "createdAt" asc
        `,
        [senderId, senderId, receiverId],
      )
        .then(result => resolve(result.rows))
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

}


module.exports = new Chat();
