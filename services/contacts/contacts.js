const { contacts: ContactsRepo } = require('../../repositories');

const getAllContacts = async id => {
  const user = new ContactsRepo(id);
  const contacts = await user.getAll();
  return contacts;
};

const addContact = async (userId, contactId) => {
  try {
    if (userId === contactId) throw 'You cannot add yourself to contacts';
    const user = new ContactsRepo(userId, contactId);
    await user.add();
    return;
  } catch (error) {
    if (error.code === '23505') {
      throw 'Already added';
    }
    throw error;
  }
};

const deleteContact = async (userId, contactId) => {
  const user = new ContactsRepo(userId, contactId);
  const result = await user.delete();
  return result;
};

const findContactsUsername = async username => {
  const user = new ContactsRepo();
  const result = await user.findUsername(username);
  return result;
};

const findContactsFullname = async fullname => {
  const user = new ContactsRepo();
  const result = await user.findFullname(fullname);
  return result;
};

module.exports = {
  getAllContacts,
  addContact,
  deleteContact,
  findContactsUsername,
  findContactsFullname,
};
