const { contacts: ContactsRepo } = require('../../repositories');
const { CustomError } = require('../../helpers/errors');

const getAllContacts = async id => {
  const user = new ContactsRepo(id);
  const contacts = await user.getAll();
  return contacts;
};

const addContact = async (userId, contactId, displayedFirstName, displayedLastName) => {
  try {
    if (userId === contactId) throw new CustomError('You cannot add yourself to contacts', 422);
    const user = new ContactsRepo(userId, contactId);
    await user.add(displayedFirstName, displayedLastName);
    return;
  } catch (error) {
    if (error.code === '23505') {
      throw new CustomError('Already added', 409);
    }
    throw new CustomError('Internal server error', 500);
  }
};

const deleteContact = async (userId, contactId) => {
  const user = new ContactsRepo(userId, contactId);
  const result = await user.delete();
  return result;
};

const findContactsUsername = async (id, username) => {
  const user = new ContactsRepo();
  const result = await user.findUsername(id, username);
  return result;
};

const findDisplayedName = async (id, displayedName) => {
  const user = new ContactsRepo();
  const result = await user.findDisplayedName(id, displayedName);
  return result;
};

const findContactsEmail = async (id, email) => {
  const user = new ContactsRepo();
  const result = await user.findEmail(id, email);
  return result;
};

const findContactEmail = async (id, email) => {
  const user = new ContactsRepo();
  const result = await user.findFullCompareEmail(id, email);
  return result;
};

const findContactsFullname = async (id, fullname) => {
  const user = new ContactsRepo();
  const result = await user.findFullname(id, fullname);
  return result;
};

const displayedNameContact = async (id, displayedFirstName, displayedLastName, userId) => {
  const user = new ContactsRepo();
  const result = await user.updateDisplayedName(id, displayedFirstName, displayedLastName, userId);
  return result;
};

module.exports = {
  getAllContacts,
  addContact,
  deleteContact,
  findContactsUsername,
  findContactsEmail,
  findContactEmail,
  findContactsFullname,
  findDisplayedName,
  displayedNameContact,
};
