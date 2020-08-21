const { user: UserRepo } = require('../../repositories');
const {
  find: ContactsFind,
} = require('../../repositories/contacts');

const banUser = async (user, bannedUser) => {
  try {
    const ban = new UserRepo(user, bannedUser);
    await ban.ban();
    return;
  } catch (error) {
    if (error.code === '23505') {
      throw 'Already banned';
    }
    throw error;
  }
};

const unBanUser = async (user, bannedUser) => {
  try {
    const ban = new UserRepo(user, bannedUser);
    await ban.unBan();
    return;
  } catch (error) {
    if (error.code === '23505') {
      throw 'Already banned';
    }
    throw '';
  }
};

const checkBan = async (user, bannedUser) => {
  try {
    const ban = new UserRepo(user, bannedUser);
    const { isBanned, inBan } = await ban.checkBans();
    return  { isBanned, inBan };
  } catch (error) {
    if (error.code === '23505') {
      throw 'Already banned';
    }
    throw 'Error';
  }
};

module.exports = {
  banUser,
  unBanUser,
  checkBan,
};
