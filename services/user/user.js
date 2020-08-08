const { user: UserRepo } = require('../../repositories');
const { contacts: ContactsRepo } = require('../../repositories');

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
const findName = async (id, name) => {
  const contact = new ContactsRepo();
  const user = new UserRepo();

  const contactResult = await contact.findDisplayedName(id, name);
  const globalResult = await user.findGlobalName(id, name);
  const response = {
    contacts: contactResult,
    global: globalResult,
  };
  return response;
};
const findUsername = async (id, name) => {
  const contact = new ContactsRepo();
  const user = new UserRepo();

  const contactResult = await contact.findUsername(id, name);
  const globalResult = await user.findGlobalUsername(id, name);
  const response = {
    contacts: contactResult,
    global: globalResult,
  };
  return response;
};
module.exports = {
  banUser,
  unBanUser,
  checkBan,
  findName,
  findUsername,
};
