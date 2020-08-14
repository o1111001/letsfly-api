'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  contacts: {
    getAllContacts,
    addContact,
    deleteContact,
    findContacts,
    findContactsFullname,
    findContactsEmail,
    findContactEmail,
    findDisplayedName,
    displayedNameContact,
  },
} = require('../../controllers');

const {
  contacts: {
    validateAddContact,
    validateDeleteContact,
    validateGetContactUsername,
    validateGetContactFullname,
  },
} = require('../../middlewares/contacts');

router.get('/',
  authorized,
  (req, res) => getAllContacts(req, res),
);

router.get('/find/username/:username',
  validateGetContactUsername,
  authorized,
  (req, res) => findContacts(req, res),
);

router.get('/find/displayedName',
  // validateGetContactUsername,
  authorized,
  (req, res) => findDisplayedName(req, res),
);

router.get('/find/email/:email',
  // validateGetContactFu,
  authorized,
  (req, res) => findContactsEmail(req, res),
);

router.get('/find/email/full_compare/:email',
  // validateGetContactFu,
  authorized,
  (req, res) => findContactEmail(req, res),
);

router.get('/find/fullname/:fullname',
  validateGetContactFullname,
  authorized,
  (req, res) => findContactsFullname(req, res),
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
  // validateDeleteContact,
  authorized,
  (req, res) => displayedNameContact(req, res),
);

module.exports = router;
