'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  chats: {
    subscribe,
    leaveChat,
    declineInvite,
  },
} = require('../../controllers');


// chat subscribers

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

module.exports = router;
