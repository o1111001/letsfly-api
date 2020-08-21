'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  getAllContacts,
  addContact,
  deleteContact,
  displayedNameContact,
} = require('../../controllers/contacts/contacts');

const {
  validateAddContact,
  validateDeleteContact,
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

module.exports = router;
