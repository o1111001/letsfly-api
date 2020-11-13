const { db } = global;

class PersonalChat {

  findIdOfPersonalChat(fields) {
    const { senderId, receiverId } = fields;
    return new Promise((resolve, reject) => {
      db.raw(`
      select cm.id as "chatMembershipId", cm."chatId"
      from chats_memberships cm
      join chats ch on ch.id = cm."chatId"
      join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
      where cmu."userId" in (?, ?)
      and ch.type = 'personal'
      group by cm.id
      having count(cm.id) = 2
      limit 1;
      `,
      [senderId, receiverId])
        .then(result => {
          resolve(result.rows.length && result.rows[0] ? result.rows[0] : { chatMembershipId: null, chatId: null });
        })
        .catch(err => reject(err));
    });
  }


  getPersonalChatByUserId({ senderId, receiverId, limit = 20, from }) {
    return new Promise((resolve, reject) => {
      db.raw(
        `
        with messages_list as (
          select 
          m.id,
          m.text,
          (select a.key from attachments a where a.id = m."attachmentId") as "attachment",
          (select a.resolution from attachments a where a.id = m."attachmentId") as "resolution",
          (select a.duration from attachments a where a.id = m."attachmentId") as "duration",
          (select a.waveform from attachments a where a.id = m."attachmentId") as "waveform",

          m."createdAt",
          m."senderId",
          m."type",
          (
            case
            when m.id <= (select "messageId" from messages_is_read where "userId" != ? order by "messageId" desc limit 1)
              then true
            else false
          end
          )::boolean as "isRead"

          from "messages" m
          where "m"."id" in (
          	select distinct cmm."messageId" 
            from chats_memberships_messages cmm 
            where cmm."chatMembershipId" = (
              select cm.id
              from chats_memberships cm
              join chats ch on ch.id = cm."chatId"
              join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
              where cmu."userId" in (?, ?)
              and ch.type = 'personal'
              group by cm.id
              having count(cm.id) = 2
              limit 1
            )
          ) and m."isDeleted" != true
          ${from && !Number.isNaN(Number(from)) ? `and m.id < ${from}` : ''}
          order by "createdAt" desc
          limit ?
              
        ) select * 
        from messages_list ml 
        order by "createdAt" desc
        `,
        [senderId, senderId, receiverId, limit],
      )
        .then(result => {
          resolve(result.rows);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = new PersonalChat();
