'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  getChats,
  readMessagesInChat,
} = require('../../controllers/chats/chat');

router.get('/',
  authorized,
  (req, res) => getChats(req, res),
);

router.put('/read/:id',
  authorized,
  (req, res) => readMessagesInChat(req, res),
);

module.exports = router;
