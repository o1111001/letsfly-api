'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const { requestWrapper } = require('../../../helpers/errors');

const {
  getAllContacts,
  addContact,
  deleteContact,
  displayedNameContact,
} = require('../controllers/contacts');

const {
  validateAddContact,
  validateDeleteContact,
} = require('../validators');

router.get('/',
  authorized,
  requestWrapper(getAllContacts),
);

router.post('/',
  validateAddContact,
  authorized,
  requestWrapper(addContact),
);

router.delete('/',
  validateDeleteContact,
  authorized,
  requestWrapper(deleteContact),
);

router.put('/displayedName',
  authorized,
  requestWrapper(displayedNameContact),
);

module.exports = router;
