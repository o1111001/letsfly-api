const { db } = global;
const promisify = require('../../helpers/promisify');

class Payments {



  checkExists(email) {
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  create(details) {
    return db('payments')
      .insert(details);
    // const trx = await promisify(db.transaction.bind(db));
    // try {
    //   await db('payments')
    //     .insert(details);

    //   if (details.status === 'Approved') {
    //     const { amount, userId } = details;
    //     await trx('user_balance')
    //       .where({ userId })
    //       .increment({
    //         balance: amount,
    //       });
    //   }

    //   await trx.commit();
    //   return {};
    // } catch (e) {
    //   console.log(e);
    //   await trx.rollback('Internal server error');
    // }
  }

  async updateStatus({ order, status }) {
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [userId, amount] = await trx('payments')
        .update({
          status,
        })
        .where({ order })
        .returning(['userId', 'amount']);

      if (status === 'approved') {
        await trx('user_balance')
          .where({ userId })
          .increment({
            balance: amount,
          });
      }

      await trx.commit();
      return true;
    } catch (e) {
      console.log(e);
      await trx.rollback('Internal server error');
    }
  }

  checkBalance(userId) {
    return new Promise((resolve, reject) => {
      db('user_balance')
        .where({
          userId,
        })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  createBalance(userId) {
    return new Promise((resolve, reject) => {
      db('user_balance')
        .insert({
          userId,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }

  add(userId, balance) {
    return new Promise((resolve, reject) => {
      db('user_balance')
        .increment({
          balance,
        })
        .where({
          userId,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
  }
}

module.exports = new Payments();
