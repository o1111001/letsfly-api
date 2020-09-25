'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const { requestWrapper } = require('../../helpers/errors');
const upload = require('../../services/files/memberships');

const {
  subscribeMembership,
} = require('../../controllers/memberships/user');

const {
  createMembership,
  updateAvatar,
  changeMembership,
  deleteMembership,
  checkName,
} = require('../../controllers/memberships/admin');


// chat admins

router.post('/',
  authorized,
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
      fileSize: 1,
    },
  ]),
  requestWrapper(createMembership),
);

router.put('/avatar',
  authorized,
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
      fileSize: 1,
    },
  ]),
  requestWrapper(updateAvatar),
);

router.put('/',
  authorized,
  requestWrapper(changeMembership),
);

router.delete('/',
  authorized,
  requestWrapper(deleteMembership),
);

router.get('/check_name/:link/:name',
  authorized,
  requestWrapper(checkName),
);

// chats users

router.post('/subscribe',
  authorized,
  requestWrapper(subscribeMembership),
);

module.exports = router;
