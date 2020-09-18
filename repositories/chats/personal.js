const { db } = global;

class PersonalChat {

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
        .then(result => resolve(result.rows.length && result.rows[0] ? result.rows[0].id : null))
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
          (select a.path from attachments a where a.id = m."attachmentId") as "attachment",
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
}

module.exports = new PersonalChat();
