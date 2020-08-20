'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  chats: {
    getChat,
    createChat,
    changeChat,
    deleteChat,
    createInvites,
    getAdmins,
    getSubscribers,
    setVisibleStatus,
    findContactsEmail,
    findContactEmail,
    findDisplayedName,
    displayedNameContact,
  },
} = require('../../controllers');


// chat admins

router.get('/',
  authorized,
  (req, res) => getChat(req, res),
);

router.post('/',
  authorized,
  (req, res) => createChat(req, res),
);

router.put('/',
  authorized,
  (req, res) => changeChat(req, res),
);

router.delete('/',
  authorized,
  (req, res) => deleteChat(req, res),
);

router.post('/invite',
  authorized,
  (req, res) => createInvites(req, res),
);

router.get('/admins',
  authorized,
  (req, res) => getAdmins(req, res),
);

router.post('/subscribers',
  authorized,
  (req, res) => getSubscribers(req, res),
);

router.patch('/message',
  authorized,
  (req, res) => setVisibleStatus(req, res),
);

module.exports = router;
