const { db } = global;

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
