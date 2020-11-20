const { db } = global;
const { CustomError } = require('../../helpers/errors');
const promisify = require('../../helpers/promisify');

const getUserOfAccessToken = access => db('tokens')
  .select('userId')
  .where({
    access,
  });

const getUserOfRefreshToken = refresh => db('tokens')
  .select('userId')
  .where({
    refresh,
  });
module.exports = {
  getUserOfAccessToken,
  getUserOfRefreshToken,
};
