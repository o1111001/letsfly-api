const { db } = global;
const { CustomError } = require('../../../helpers/errors');
const { getMessages, getMainChatInfo } = require('../../chats/repositories');
const promisify = require('../../../helpers/promisify');

const subscribe = async ({ userId, membershipId: chatMembershipId, period }) => {
  const trx = await promisify(db.transaction.bind(db));
  try {
    const [ membership ] = await trx('chats_memberships').where({ id: chatMembershipId });
    if (membership.type === 'standard') {
      const subscribs = await trx('chats_memberships_users')
        .select('id')
        .where({ userId, chatMembershipId });

      if (subscribs.length) throw new CustomError('Already subscribed', 409);
      await trx('chats_memberships_users')
        .insert({
          userId,
          chatMembershipId,
          amount: 0,
          endedAt: Infinity,
        });
    } else if (membership.type === 'paid') {

      const [{ balance }] = await trx('user_balance').select('balance').where({ userId });
      const [{ adminId }] = await trx('chats_admins').select('adminId').where({ chatId: membership.chatId });
      if (balance < membership.amount * period) {
        throw new CustomError('Insufficient funds', 409);
      }
      const [existedMembershipSubscribe] = await trx('chats_memberships_users')
        .select('*')
        .where('endedAt', '>', 'now()')
        .andWhere({ userId, chatMembershipId })
        .orderBy('endedAt', 'desc')
        .limit(1);
      const data = existedMembershipSubscribe ? [
        userId,
        period * membership.amount,
        chatMembershipId,
        existedMembershipSubscribe.endedAt,
        existedMembershipSubscribe.endedAt,
        period,
      ] : [
        userId,
        period * membership.amount,
        chatMembershipId,
        period,
      ];

      const raw = existedMembershipSubscribe ? `
        insert into chats_memberships_users 
        ("userId", "amount", "chatMembershipId", "createdAt", "endedAt")
        values
        (?, ?, ?, ?, ? + (interval '30 days') * ?)
        returning amount as "userPaid", amount * 0.8 as "adminGet"
      ` : `
        insert into chats_memberships_users 
        ("userId", "amount", "chatMembershipId", "createdAt", "endedAt")
        values
        (?, ?, ?, now(), now() + (interval '30 days') * ?)
        returning amount as "userPaid", amount * 0.8 as "adminGet"
      `;

      const { rows: [{ userPaid, adminGet }] } = await trx
        .raw(raw, data);

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

    }
    const { messages, hasMore } =  await getMessages({ userId, chatId: membership.chatId }, {}, trx);
    const opponent = await getMainChatInfo(membership.chatId, trx);
    await trx.commit();
    return { messages, opponent, hasMore };
  } catch (error) {
    await trx.rollback(error);
    throw new CustomError(error.message || error, error.status);
  }
};

module.exports = {
  subscribe,
};
