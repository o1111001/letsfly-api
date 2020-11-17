const { db } = global;
const promisify = require('../../helpers/promisify');

class SignUp {
  constructor(email) {
    this.email = email;
  }
  checkExists() {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  async create() {
    const { email } = this;
    const trx = await promisify(db.transaction.bind(db));
    try {
      const [userId] = await db('users')
        .insert({
          email,
          createdAt: db.fn.now(6),
          updatedAt: db.fn.now(6),
        })
        .returning('id');

      await db('user_balance')
        .insert({
          userId,
        });

      await trx.commit();
      return [{ id: userId }];
    } catch (e) {
      console.log(e);
      await trx.rollback('Internal server error');
    }
  }

  addCode(hash) {
    const { email } = this;
    return new Promise((resolve, reject) => {
      db('users')
        .where({ email })
        .update({
          hash,
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

}

module.exports = SignUp;
