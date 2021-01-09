'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const { requestWrapper } = require('../../helpers/errors');

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
} = require('../../validators/contacts');


router.get('/username/:username',
  validateGetContactUsername,
  authorized,
  requestWrapper(findContacts),
);

router.get('/displayedName',
  authorized,
  requestWrapper(findDisplayedName),
);

router.get('/email/:email',
  authorized,
  requestWrapper(findContactsEmail),
);

router.get('/email/full_compare/:email',
  authorized,
  requestWrapper(findContactEmail),
);

router.get('/fullname/:fullname',
  validateGetContactFullname,
  authorized,
  requestWrapper(findContactsFullname),
);


module.exports = router;
