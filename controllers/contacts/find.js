const {
  findContactsUsername: findContactsUsernameService,
  findContactsEmail: findContactsEmailService,
  findContactEmail: findContactEmailService,
  findContactsFullname: findContactsFullnameService,
  findDisplayedName: findDisplayedNameService,
  displayedNameContact: displayedNameContactService,
} = require('../../services/contacts/contacts');

const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const findContacts = async (req, res) => {
  try {
    const { username } = req.params;
    const { id } = req.locals;
    const data = await findContactsUsernameService(id, username);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

const findDisplayedName = async (req, res) => {
  try {
    const { displayedName } = req.query;
    const { id } = req.locals;
    const data = await findDisplayedNameService(id, displayedName);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

const findContactsEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { id } = req.locals;

    const data = await findContactsEmailService(id, email);
    return res.send(response(data));

  } catch (error) {
    return sendError(res, error);
  }
};

const findContactEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { id } = req.locals;

    const data = await findContactEmailService(id, email);
    return res.send(response(data));

  } catch (error) {
    return sendError(res, error);
  }
};

const findContactsFullname = async (req, res) => {
  try {
    const { fullname } = req.params;
    const { id } = req.locals;

    const data = await findContactsFullnameService(id, fullname);
    return res.send(response(data));

  } catch (error) {
    return sendError(res, error);
  }
};

const displayedNameContact = async (req, res) => {
  try {
    const { displayedFirstName, displayedLastName, id: userId } = req.body;
    const { id } = req.locals;
    const data = await displayedNameContactService(id, displayedFirstName, displayedLastName, userId);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  findContacts,
  findContactsFullname,
  findContactsEmail,
  findContactEmail,
  findDisplayedName,
  displayedNameContact,
};
