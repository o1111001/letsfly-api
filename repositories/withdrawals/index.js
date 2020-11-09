const { db } = global;
const { CustomError } = require('../../helpers/errors');
const promisify = require('../../helpers/promisify');
const { checkBalance } = require('../../repositories/payments');

class Withdraw {
  constructor(id) {
    this.id = id;
  }

  async create(userId, amount, cardNumber, comment) {
    const trx = await promisify(db.transaction.bind(db));
    try {

      const [{ balance }] = await checkBalance(userId, trx);

      const waitWithdraw = await this.getAmountToWithdraw(userId, trx);

      if ((balance - waitWithdraw) < amount) {
        throw new CustomError('Insufficient funds', 505);
      }

      const data = await trx('withdrawals')
        .insert({
          userId,
          amount,
          status: 'requested',
          cardNumber,
          comment,
        })
        .returning(['id']);

      await trx.commit();
      return data;
    } catch (error) {
      await trx.rollback(error);
      throw new CustomError('Insufficient funds', 505);

    }
  }

  get(id) {
    return new Promise((resolve, reject) => {
      db('withdrawals')
        .where({ id })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }

  async getAmountToWithdraw(userId, trx) {
    const [{ sum }] = await (db || trx)('withdrawals').sum('amount').where({ userId, status: 'requested' });
    return +sum;
  }

  getBalance(userId) {
    return new Promise((resolve, reject) => {
      db('user_balance')
        .where({ userId })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }
  async updateStatus(id, status) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [{ amount, userId }] = await trx('withdrawals')
        .update({
          status,
        })
        .where({ id })
        .returning(['amount', 'userId']);

      if (status === 'approved') {
        await trx('user_balance')
          .where({ userId })
          .decrement({
            balance: amount,
          });
      }

      await trx.commit();
      return { amount, userId };
    } catch (e) {
      console.log(e);
      await trx.rollback('Internal server error');
    }
  }

  debit(userId, amount) {
    return new Promise((resolve, reject) => {
      db('user_balance')
        .where({ userId })
        .decrement({
          balance: amount,
        })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }
  list(userId) {
    return new Promise((resolve, reject) => {
      db('withdrawals')
        .where({
          userId,
        })
        .orderBy('createdAt', 'desc')
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  fullList() {
    return new Promise((resolve, reject) => {
      db('withdrawals')
        .orderBy('createdAt', 'desc')
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  async fullUserHistory(userId) {
    const { rows: list } = await db.raw(`
      select 
        amount,
        status,
        "updatedAt",
        "createdAt",
        'payment' as "type",
        '' as "name",
        '' as "membershipName"


      from payments p
      where p."userId" = ? and p.status = 'approved'

      union

      select 
        amount,
        status,
        "updatedAt",
        "createdAt",
        'withdraw' as "type",
        '' as "name",
        '' as "membershipName"


      from withdrawals w
      where w."userId" = ?

      union
      
      select 
        cmu."amount" * 0.8 as "amount",
        'success' as "status",
        cmu."endedAt",
        cmu."createdAt",
        'chatSub' as "type",

        c.name as "name",
        cm.name as "membershipName"

        from chats_admins ca
        join chats c on c.id = ca."chatId"
        join chats_memberships cm on cm."chatId" = c.id
        join chats_memberships_users cmu on cmu."chatMembershipId" = cm.id
        where ca."adminId" = ? and cm.type = 'paid'

      union
      
      select 
        cmu."amount",
        'success' as "status",
        cmu."endedAt",
        cmu."createdAt",
        'chatSubForeign' as "type",
  
        c.name as "name",
        cm.name as "membershipName"

        from chats_memberships_users cmu
        join chats_memberships cm on cm.id = cmu."chatMembershipId"
        join chats c on c.id = cm."chatId"
        where cmu."userId" = ? and cm.type = 'paid'

      order by "createdAt" desc
    `,
    [userId, userId, userId, userId],
    );
    console.log(list);
    return list;
  }
}

module.exports = Withdraw;
