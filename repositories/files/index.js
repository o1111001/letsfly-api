const { db } = global;
const promisify = require('../../helpers/promisify');
const { CustomError } = require('../../helpers/errors');

const checkAccess = async (userId, key) => {
  const trx = await promisify(db.transaction.bind(db));
  try {
    const { rows: [message] } = await trx.raw(`
      select m."id", m."senderId" from attachments a
      join messages m on m."attachmentId" = a.id
      where a."key" = ?
    `, [key]);
    if (message.senderId === userId) return true;

    const { rows: memberships } = await trx.raw(`
      select 
      distinct cm."id"
      from chats_memberships_messages cmm
      join chats_memberships cm on cm.id = cmm."chatMembershipId"
      join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
      left join chats_admins ca on ca."chatId" = cm."chatId"
      where cmm."messageId" = ?
      and (
        (
          ca."adminId" = ?
        ) or (
          cm.type = 'standard'
        ) or (
          cmu."userId" = ? and cmu."endedAt" > now()
        )
      )
    `, [message.id, userId, userId]);
    await trx.commit();
    return Boolean(memberships.length);
  } catch (error) {
    await trx.rollback(error);
    throw new CustomError('Check access error', 422);
  }
};

module.exports = {
  checkAccess,
};
