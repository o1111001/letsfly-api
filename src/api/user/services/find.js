const { user: UserRepo } = require('../repositories');
const {
  find: ContactsFind,
} = require('../../contacts/repositories');

const findName = async (id, name) => {
  const user = new UserRepo();

  const contactResult = await ContactsFind.findActive(id, name);
  const globalResult = await user.findGlobalName(id, name);
  const response = {
    contacts: contactResult,
    global: globalResult,
  };
  return response;
};

const findUsername = async (id, name) => {
  const user = new UserRepo();

  const contactResult = await ContactsFind.findUsername(id, name);
  const globalResult = await user.findGlobalUsername(id, name);
  const response = {
    contacts: contactResult,
    global: globalResult,
  };
  return response;
};

module.exports = {
  findName,
  findUsername,
};
