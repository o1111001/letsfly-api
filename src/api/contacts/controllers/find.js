const {
  findContactsUsername: findContactsUsernameService,
  findContactsEmail: findContactsEmailService,
  findContactEmail: findContactEmailService,
  findContactsFullname: findContactsFullnameService,
  findDisplayedName: findDisplayedNameService,
  displayedNameContact: displayedNameContactService,
} = require('../services/contacts');

const response = data => ({
  message: `Success`,
  data,
});

const findContacts = async req => {
  const { username } = req.params;
  const { id } = req.locals;
  const data = await findContactsUsernameService(id, username);
  return response(data);
};

const findDisplayedName = async req => {
  const { displayedName } = req.query;
  const { id } = req.locals;
  const data = await findDisplayedNameService(id, displayedName);
  return response(data);
};

const findContactsEmail = async req => {
  const { email } = req.params;
  const { id } = req.locals;

  const data = await findContactsEmailService(id, email);
  return response(data);

};

const findContactEmail = async req => {
  const { email } = req.params;
  const { id } = req.locals;

  const data = await findContactEmailService(id, email);
  return response(data);

};

const findContactsFullname = async req => {
  const { fullname } = req.params;
  const { id } = req.locals;

  const data = await findContactsFullnameService(id, fullname);
  return response(data);

};

const displayedNameContact = async req => {
  const { displayedFirstName, displayedLastName, id: userId } = req.body;
  const { id } = req.locals;
  const data = await displayedNameContactService(id, displayedFirstName, displayedLastName, userId);
  return response(data);
};

module.exports = {
  findContacts,
  findContactsFullname,
  findContactsEmail,
  findContactEmail,
  findDisplayedName,
  displayedNameContact,
};
