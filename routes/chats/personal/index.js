'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');

const {
  getChatByUserId,
  getCountAttachmentsFromChat,
  getFiles,
} = require('../../../controllers/chats/personal');

router.get('/users/:id',
  authorized,
  (req, res) => getChatByUserId(req, res),
);

router.get('/attachments/count/:id',
  authorized,
  (req, res) => getCountAttachmentsFromChat(req, res),
);

router.get('/files/:id/:type',
  authorized,
  (req, res) => getFiles(req, res),
);

module.exports = router;
