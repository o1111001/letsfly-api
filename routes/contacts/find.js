'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  find: {
    findContacts,
    findContactsFullname,
    findContactsEmail,
    findContactEmail,
    findDisplayedName,
  },
} = require('../../controllers/contacts');

const {
  validateGetContactUsername,
  validateGetContactFullname,
} = require('../../middlewares/contacts');


router.get('/username/:username',
  validateGetContactUsername,
  authorized,
  (req, res) => findContacts(req, res),
);

router.get('/displayedName',
  authorized,
  (req, res) => findDisplayedName(req, res),
);

router.get('/email/:email',
  authorized,
  (req, res) => findContactsEmail(req, res),
);

router.get('/email/full_compare/:email',
  authorized,
  (req, res) => findContactEmail(req, res),
);

router.get('/fullname/:fullname',
  validateGetContactFullname,
  authorized,
  (req, res) => findContactsFullname(req, res),
);


module.exports = router;
