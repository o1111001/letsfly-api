'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../../policies/authorized');
const authorizedNotThrowable = require('../../../../policies/authorizedNotThrowable');

const { requestWrapper } = require('../../../../helpers/errors');

const {
  createChat,
  changeChat,
  deleteChat,
  createInvites,
  getAdmins,
  getSubscribers,
  setVisibleStatus,
  getContacts,
  getContactsForNewChat,
  checkLink,
  joinUsers,
  updateAvatar,
} = require('../../controllers/group/admins');

const {
  getChat,
  subscribe,
  leaveChat,
  declineInvite,
  privateSubscribe,
  getMessagesOffset,
} = require('../../controllers/group/users');

// chat admins

router.post('/',
  authorized,
  requestWrapper(createChat),
);

router.get('/contacts/chat/:id',
  authorized,
  requestWrapper(getContacts),
);

router.get('/contacts/:link',
  authorized,
  requestWrapper(getContactsForNewChat),
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

router.post('/join_users',
  authorized,
  requestWrapper(joinUsers),
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

router.get('/check_link/:link',
  authorized,
  requestWrapper(checkLink),
);

router.put('/avatar',
  authorized,
  requestWrapper(updateAvatar),
);

// subscribers -- need to implement

router.get('/link/:link',
  authorizedNotThrowable,
  requestWrapper(getChat),
);

router.get('/messages',
  authorizedNotThrowable,
  requestWrapper(getMessagesOffset),
);

router.post('/subscribe',
  authorized,
  requestWrapper(subscribe),
);

router.post('/private_subscribe',
  authorized,
  requestWrapper(privateSubscribe),
);

router.delete('/subscribe',
  authorized,
  requestWrapper(leaveChat),
);

router.delete('/invite',
  authorized,
  requestWrapper(declineInvite),
);

module.exports = router;
