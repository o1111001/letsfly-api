'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const { requestWrapper } = require('../../../helpers/errors');

const {
  createChat,
  changeChat,
  deleteChat,
  createInvites,
  getAdmins,
  getSubscribers,
  setVisibleStatus,
} = require('../../../controllers/chats/group/admins');

// chat admins

router.post('/',
  authorized,
  requestWrapper(createChat),
);

router.put('/',
  authorized,
  requestWrapper(changeChat),
);

router.delete('/',
  authorized,
  requestWrapper(deleteChat),
);

router.post('/invite',
  authorized,
  requestWrapper(createInvites),
);

router.get('/admins',
  authorized,
  requestWrapper(getAdmins),
);

router.post('/subscribers',
  authorized,
  requestWrapper(getSubscribers),
);

router.patch('/message',
  authorized,
  requestWrapper(setVisibleStatus),
);

// subscribers -- need to implement
/*
router.get('/',
  // authorized,
  (req, res) => getChat(req, res),
);

router.post('/subscribe',
  authorized,
  (req, res) => subscribe(req, res),
);

router.delete('/leave',
  authorized,
  (req, res) => leaveChat(req, res),
);

router.delete('/invite',
  authorized,
  (req, res) => declineInvite(req, res),
);
*/
module.exports = router;
