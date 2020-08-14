const { db } = global;

class Withdraw {
  constructor(id) {
    this.id = id;
  }

  create(userId, amount, cardNumber, comment) {
    return new Promise((resolve, reject) => {
      db('withdrawals')
        .insert({
          userId,
          amount,
          status: 'requested',
          cardNumber,
          comment,
        })
        .returning(['id'])
        .then(result => {
          if (result[0]) return resolve();
          return reject('Error');
        })
        .catch(err => reject(err));
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      db('withdrawals')
        .where({ id })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }
  getBalance(userId) {
    return new Promise((resolve, reject) => {
      db('user_balance')
        .where({ userId })
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
  }
  updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      db('withdrawals')
        .update({
          status,
        })
        .where({ id })
        .returning(['amount', 'userId'])
        .then(res => resolve(res[0]))
        .catch(err => reject(err));
    });
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
}

module.exports = Withdraw;
