const { db } = global;

class PrivateMessage {
  constructor(senderId, receiverId, text, type, attachment) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.text = text;
    this.type = type;
    this.attachment = attachment;
  }

  checkContact() {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db('contacts')
        .where({
          userId: senderId,
          contact: receiverId,
        })
        .orWhere({
          userId: receiverId,
          contact: senderId,
        })
        .then(result => {
          if (result.length) return resolve(result[0]);
          return reject('Please add user to contacts');
        })
        .catch(err => reject(err));
    });
  }

  checkChat() {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db.raw(`
      select ch.id,
      (select json_build_object(
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
        'displayedName', (select concat(c1."displayedFirstName", ' ', c1."displayedLastName") from contacts c1 where (c1."contact" = ? and c1."userId" = ?) )
      ) as user1 from users u1 where id = ch.user1),
      (select json_build_object(
        'id', u2.id,
        'username',  u2."username",
        'firstName',  u2."firstName",
        'lastName',  u2."lastName",
        'email',  u2."email",
        'phone',  u2."phone",
        'about',  u2."about",
        'avatar',  u2."avatar",
        'isOnline',  u2."isOnline",
        'lastOnline',  u2."lastOnline",
        'displayedName', (select concat(c2."displayedFirstName", ' ', c2."displayedLastName") from contacts c2 where (c2."contact" = ? and c2."userId" = ?) )
      ) as user2 from users u2 where id = ch.user2)
      from private_chats ch
      where (ch.user1 = ? and ch.user2 = ?) or (ch.user2 = ? and ch.user1 = ?)
      `,
      [senderId, receiverId, senderId, receiverId, senderId, receiverId, senderId, receiverId])
        .then(result => resolve(result.rows[0]))
        .catch(err => reject(err));
    });
  }
  /*
(select json_build_object(
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
        ) as user1 from users u1 where id = ch.user1),
        (select json_build_object(
          'id', u2.id,
          'username',  u2."username",
          'firstName',  u2."firstName",
          'lastName',  u2."lastName",
          'email',  u2."email",
          'phone',  u2."phone",
          'about',  u2."about",
          'avatar',  u2."avatar",
          'isOnline',  u2."isOnline",
          'lastOnline',  u2."lastOnline",
          'displayedName', (select concat(c."displayedFirstName", ' ', c."displayedLastName") from contacts c where (c."userId" = ? and c.contact = u2.id) )
*/
  getChat(id) {
    return new Promise((resolve, reject) => {
      db('private_chats')
        .where({
          id,
        })
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  deleteChat(id) {
    return new Promise((resolve, reject) => {
      db('private_chats')
        .where({
          id,
        })
        .del()
        .returning(['id'])
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

  createChat() {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db('private_chats')
        .insert({
          user1: senderId,
          user2: receiverId,
        })
        .returning(['id'])
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  createAttachment(type) {
    const { attachment } = this;
    return new Promise((resolve, reject) => {
      db('attachments')
        .insert({
          path: attachment,
          type,
        })
        .returning(['id'])
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      db('messages')
        .where({
          id,
        })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  create(chatId, attachmentId) {
    const { senderId, text, type, attachment } = this;
    return new Promise((resolve, reject) => {
      db('messages')
        .insert({
          chatId,
          senderId,
          text,
          type,
          attachment,
          attachmentId,
        })
        .returning(['id', 'chatId', 'senderId', 'text', 'attachment', 'createdAt', 'type'])
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  unReadMessagesInChat(chatId) {
    const { senderId } = this;
    return new Promise((resolve, reject) => {
      db('messages')
        .count('*')
        .where({
          senderId,
          chatId,
        })
        .andWhereRaw('"isRead" != true')
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  getMessageListPreview() {
    const { senderId } = this;
    return new Promise((resolve, reject) => {
      db('messages')

        .then(result => {
          if (result.length) return resolve(result);
          return reject('Please add user to contacts');
        })
        .catch(err => reject(err));
    });
  }

  getCountAttachments() {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db.raw(
        `with files as (
          select pa."type" 
          from private_chats ch
          left join messages pm on pm."chatId" = ch.id
          left join attachments pa on pa.id = pm."attachmentId"
          where ((user1 = ? and user2 = ?) or (user1 = ? and user2 = ?)) and attachment is not null
        ) select 
        (select count(*)::int as "photo" from files where type = 'photo'),
        (select count(*)::int as "video" from files where type = 'video'),
        (select count(*)::int as "audio" from files where type = 'audio'),
        (select count(*)::int as "audio_message" from files where type = 'audio_message'),
        (select count(*)::int as "file" from files where type = 'another')
        `,
        [senderId, receiverId, receiverId, senderId],
      )
        .then(result => resolve(result.rows[0]))
        .catch(err => reject(err));
    });
  }

  getChatByUserId() {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db.raw(
        `
        with messages as (
          select *
          from "private_chats" 
          inner join "messages" on "messages"."chatId" = "private_chats"."id" 
          where ("user1" = ? and "user2" = ?) or ("user1" = ? and "user2" = ?) 
          order by "createdAt" desc limit 30
        ) select * from messages order by "createdAt" asc
        `,
        [senderId, receiverId, receiverId, senderId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }

  getMessagesChatByUserId(id) {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db('private_chats')
        .join('messages', 'messages.chatId', 'private_chats.id')
        .whereRaw(`(
          ("user1" = ? and "user2" = ? )
          or ("user1" = ? and "user2" = ?)
          )
          and messages."id" < ? `,
        [senderId, receiverId, receiverId, senderId, id])
        .orderBy('createdAt', 'desc')
        .limit(10)
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }


  deleteMessageById(id) {
    return new Promise((resolve, reject) => {
      db('messages')
        .where({
          id,
        })
        .del()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
  readMessages(chatId, userId) {
    return new Promise((resolve, reject) => {
      db('messages')
        .where({
          chatId,
        })
        .andWhereNot('isRead', true)
        .andWhereNot('senderId', userId)
        .update({
          isRead: true,
        })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  getChats() {
    const { senderId } = this;
    return new Promise((resolve, reject) => {
      db.raw(
        `select
        pm."chatId",
        pm."text",
        pm."createdAt",
        pm."type",
        pm."isRead",
        pm."attachment",
        pm."senderId",
        (select json_build_object(
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
        ) as user1 from users u1 where id = ch.user1),
        (select json_build_object(
          'id', u2.id,
          'username',  u2."username",
          'firstName',  u2."firstName",
          'lastName',  u2."lastName",
          'email',  u2."email",
          'phone',  u2."phone",
          'about',  u2."about",
          'avatar',  u2."avatar",
          'isOnline',  u2."isOnline",
          'lastOnline',  u2."lastOnline",
          'displayedName', (select concat(c."displayedFirstName", ' ', c."displayedLastName") from contacts c where (c."userId" = ? and c.contact = u2.id) )


        ) as user2 from users u2 where id = ch.user2),
        (select count(*)::int as "count"
          from messages m 
          where m."chatId" = pm."chatId" and "senderId" = pm."senderId" and m."isRead" != true
        )
        from messages pm
        inner join private_chats ch on ch.id = pm."chatId"

        where pm.id in (
          select max(pm.id) as "unread" from private_chats ch
          inner join messages pm on pm."chatId" = ch.id
          where ch.user1 = ? or ch.user2 = ? 
          group by ch.id
        )
        order by pm."createdAt" desc`,
        [senderId, senderId, senderId, senderId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }
  getFiles(user1, user2, type) {
    return new Promise((resolve, reject) => {
      db.raw(
        `select 
          pa.id, 
          pa.type, 
          pa."createdAt", 
          pa.path,
          (select pm."senderId" from messages pm where pm."attachmentId" = pa.id)
        from "attachments" pa
        where "id" in (
          select "attachmentId"
          from "messages" 
          where "chatId" in (
            select "id" 
            from "private_chats" 
            where ("user1" = ? and "user2" = ?) or ("user2" = ? and "user1" = ?)
          )
        ) and "type" = ?
        order by pa."createdAt" desc`,
        [user1, user2, user1, user2, type],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }
}
// select * from "attachments" where "id" in (select "attachmentId", "senderId" from "messages" where "chatId" in (select "id" from "private_chats" where "user1" = $1 and "user2" = $2 or ("user2" = $3 and "user1" = $4))) and "type" = $5


module.exports = PrivateMessage;
