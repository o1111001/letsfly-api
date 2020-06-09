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
      db('private_chats')
        .where({
          user1: senderId,
          user2: receiverId,
        })
        .orWhere({
          user1: receiverId,
          user2: senderId,
        })
        .then(result => resolve(result[0]))
        .catch(err => reject(err));
    });
  }

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
      db('private_attachments')
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
      db('private_messages')
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
      db('private_messages')
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
      db('private_messages')
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
      db('private_messages')

        .then(result => {
          if (result.length) return resolve(result);
          return reject('Please add user to contacts');
        })
        .catch(err => reject(err));
    });
  }

  getChatByUserId() {
    const { senderId, receiverId } = this;
    return new Promise((resolve, reject) => {
      db('private_chats')
        .join('private_messages', 'private_messages.chatId', 'private_chats.id')
        .where({
          user1: senderId,
          user2: receiverId,
        })
        .orWhere({
          user1: receiverId,
          user2: senderId,
        })
        .orderBy('createdAt', 'asc')
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  deleteMessageById(id) {
    return new Promise((resolve, reject) => {
      db('private_messages')
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
      db('private_messages')
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
          'lastOnline',  u1."lastOnline"
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
          'lastOnline',  u2."lastOnline"
        ) as user2 from users u2 where id = ch.user2),
        (select count(*) as "count"
          from private_messages m 
          where m."chatId" = pm."chatId" and "senderId" = ch.user2 and m."isRead" != true
        )
        from private_messages pm
        inner join private_chats ch on ch.id = pm."chatId"

        where pm.id in (
          select max(pm.id) as "unread" from private_chats ch
          inner join private_messages pm on pm."chatId" = ch.id
          where ch.user1 = ? or ch.user2 = ? 
          group by ch.id
        )
        order by pm."createdAt" desc`,
        [senderId, senderId],
      )
        .then(result => resolve(result.rows))
        .catch(err => reject(err));
    });
  }
  getFiles(user1, user2, type) {
    return new Promise((resolve, reject) => {
      db('private_attachments')
        .whereIn(`id`,
          db('private_messages')
            .select('attachmentId')
            .whereIn('chatId',
              db('private_chats')
                .select('id')
                .where({
                  user1,
                  user2,
                })
                .orWhere({
                  user2: user1,
                  user1: user2,
                }),
            ),
        )
        .where({ type })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
}



module.exports = PrivateMessage;
