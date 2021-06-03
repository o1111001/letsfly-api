'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');

const { requestWrapper } = require('../../../helpers/errors');

const {
  subscribeMembership,
} = require('../controllers/user');

const {
  createMembership,
  updateAvatar,
  updateMembershipInfo,
  deleteMembership,
  checkName,
} = require('../controllers//admin');


// chat admins

router.post('/',
  authorized,
  requestWrapper(createMembership),
);

router.put('/avatar',
  authorized,
  requestWrapper(updateAvatar),
);

router.put('/',
  authorized,
  requestWrapper(updateMembershipInfo),
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
