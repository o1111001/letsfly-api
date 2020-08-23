'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const { requestWrapper } = require('../../helpers/errors');

const {
  getChats,
  readMessagesInChat,
} = require('../../controllers/chats/chat');

router.get('/',
  authorized,
  requestWrapper(getChats),
);

router.put('/read/:id',
  authorized,
  requestWrapper(readMessagesInChat),
);

module.exports = router;
