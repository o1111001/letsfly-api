const { user: UserRepo } = require('../../repositories');
const { CustomError } = require('../../helpers/errors');

const banUser = async (user, bannedUser) => {
  try {
    const ban = new UserRepo(user, bannedUser);
    await ban.ban();
    return;
  } catch (error) {
    if (error.code === '23505') {
      throw new CustomError('Already banned', 409);
    }
    throw new CustomError('Internal server error', 500);
  }
};

const unBanUser = async (user, bannedUser) => {
  const ban = new UserRepo(user, bannedUser);
  await ban.unBan();
  return;
};

const checkBan = async (user, bannedUser) => {
  const ban = new UserRepo(user, bannedUser);
  const { isBanned, inBan } = await ban.checkBans();
  return  { isBanned, inBan };
};

module.exports = {
  banUser,
  unBanUser,
  checkBan,
};
