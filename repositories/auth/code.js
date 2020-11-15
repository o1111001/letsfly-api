const { db } = global;
const { CustomError } = require('../../helpers/errors');
const promisify = require('../../helpers/promisify');

// const getUser = email => {
//   return new Promise((resolve, reject) => {
//     db('users')
//       .where({ email })
//       .then(result => {
//         if (result.length) return resolve(result[0]);
//         return reject(new CustomError('Email does not exist', 404));
//       })
//       .catch(err => reject(err));
//   });
// };

const addCode = (userId, code) => db.raw(`
    INSERT INTO login_codes
      ("userId", "code", "expires")
    values
      (?, ?, now() + (interval '1 hour'))
    ON CONFLICT ("userId") DO UPDATE SET
      code = ?,
      expires = (now() + (interval '1 hour')),
      attempts = 0
    WHERE
    login_codes."userId" = ?`,
[userId, code, code, userId],
);

const removeCode = email => new Promise((resolve, reject) => {
  db('users')
    .where({ email })
    .update({
      hash: null,
    })
    .then(resolve())
    .catch(err => reject(err));
});

const addToken = (userId, access, refresh, fingerprint) => db('tokens')
  .insert({
    userId,
    access,
    refresh,
    refreshExpire: db.raw(`now() + (interval '60 days')`),
    fingerprint,
  });

const removeRefreshToken = refresh => db('tokens')
  .where({
    refresh,
  })
  .del();

const replaceToken = async (userId, clientRefreshToken, access, refresh, fingerprint) => {
  const trx = await promisify(db.transaction.bind(db));
  try {
    const [{ fingerprint: fingerprintFromDB }] = await trx('tokens')
      .where({
        userId,
        refresh: clientRefreshToken,
      });

    await trx('tokens')
      .where({
        refresh: clientRefreshToken,
      })
      .del();

    if (fingerprintFromDB !== fingerprint) {
      await trx.commit();
      return new CustomError('Wrong credentials', 403);
    }

    await trx('tokens')
      .insert({
        userId,
        access,
        refresh,
        refreshExpire: db.raw(`now() + (interval '60 days')`),
        fingerprint,
      });

    await trx.commit();
    return;
  } catch (error) {
    await trx.rollback(error);
  }
  // db('tokens')
  // .insert({
  //   userId,
  //   access,
  //   refresh,
  //   refreshExpire: db.raw(`now() + (interval '60 days')`),
  //   fingerprint,
  // });
};

const getCode = userId => db('login_codes')
  .select(['code', 'attempts', 'expires'])
  .where({ userId });

const removeCodes = userId => db('login_codes')
  .where({ userId })
  .del();

const incrementAttemps = userId => db('login_codes')
  .increment({
    attempts: 1,
  })
  .where({ userId });

module.exports = {
  addCode,
  addToken,
  getCode,
  removeCodes,
  incrementAttemps,
  replaceToken,
  removeRefreshToken,
};
