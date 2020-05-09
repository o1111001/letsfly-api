const {
  contacts: {
    getAllContacts: getAllContactsService,
    addContact: addContactService,
    deleteContact: deleteContactService,
    findContactsUsername: findContactsUsernameService,
    findContactsFullname: findContactsFullnameService,
  } } = require('../../services/contacts');

const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const getAllContacts = async (req, res) => {
  try {
    const { id } = req.locals;
    const data = await getAllContactsService(id);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

const addContact = async (req, res) => {
  try {
    const { id: userId } = req.locals;
    const { id: contactId } = req.body;
    await addContactService(userId, contactId);
    return res.send(response());
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id: userId } = req.locals;
    const { id: contactId } = req.body;
    const data = await deleteContactService(userId, contactId);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

const findContacts = async (req, res) => {
  try {
    const { username } = req.params;
    const data = await findContactsUsernameService(username);
    return res.send(response(data));

  } catch (error) {
    return sendError(res, error);
  }
};

const findContactsFullname = async (req, res) => {
  try {
    const { fullname } = req.params;
    const data = await findContactsFullnameService(fullname);
    return res.send(response(data));

  } catch (error) {
    return sendError(res, error);
  }
};
module.exports = {
  getAllContacts,
  addContact,
  deleteContact,
  findContacts,
  findContactsFullname,
};
