'use strict';

const express = require('express');
const router = express.Router();

const { requestWrapper } = require('../../../helpers/errors');

const authorized = require('../../../policies/authorized');

const {
  getChatByUserId,
  getCountAttachmentsFromChat,
  getFiles,
  getMessagesOffset,
} = require('../../../controllers/chats/personal');

router.get('/users/:id',
  authorized,
  requestWrapper(getChatByUserId),
);

router.get('/attachments/count/:id',
  authorized,
  requestWrapper(getCountAttachmentsFromChat),
);

router.get('/files/:id/:type',
  authorized,
  requestWrapper(getFiles),
);

router.get('/users/:id/messages',
  authorized,
  requestWrapper(getMessagesOffset),
);

module.exports = router;
