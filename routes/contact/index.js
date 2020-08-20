'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  getAllContacts,
  addContact,
  deleteContact,
  findContacts,
  findContactsFullname,
  findContactsEmail,
  findContactEmail,
  findDisplayedName,
  displayedNameContact,
} = require('../../controllers/contacts');

const {
  validateAddContact,
  validateDeleteContact,
  validateGetContactUsername,
  validateGetContactFullname,
} = require('../../middlewares/contacts');

router.get('/',
  authorized,
  (req, res) => getAllContacts(req, res),
);

router.post('/',
  validateAddContact,
  authorized,
  (req, res) => addContact(req, res),
);

router.delete('/',
  validateDeleteContact,
  authorized,
  (req, res) => deleteContact(req, res),
);

router.put('/displayedName',
  authorized,
  (req, res) => displayedNameContact(req, res),
);

router.get('/find/username/:username',
  validateGetContactUsername,
  authorized,
  (req, res) => findContacts(req, res),
);

router.get('/find/displayedName',
  authorized,
  (req, res) => findDisplayedName(req, res),
);

router.get('/find/email/:email',
  authorized,
  (req, res) => findContactsEmail(req, res),
);

router.get('/find/email/full_compare/:email',
  authorized,
  (req, res) => findContactEmail(req, res),
);

router.get('/find/fullname/:fullname',
  validateGetContactFullname,
  authorized,
  (req, res) => findContactsFullname(req, res),
);


module.exports = router;
