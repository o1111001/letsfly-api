const { db } = global;

class Payments {
  constructor(id) {
    this.id = id;
  }

  checkExists(email) {
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  create(userId, amount, status, orderReference, signature) {
    return new Promise((resolve, reject) => {
      db('payments')
        .insert({
          userId,
          amount,
          status,
          orderReference,
          signature,
        })
        .then(resolve())
        .catch(err => reject(err));
    });
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

  // getHistory(userId, balance) {
  //   return new Promise((resolve, reject) => {
  //     db('user_balance')
  //       .increment({
  //         balance,
  //       })
  //       .where({
  //         userId,
  //       })
  //       .then(resolve())
  //       .catch(err => reject(err));
  //   });
  // }

}

module.exports = Payments;
