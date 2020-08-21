'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const upload = require('../../services/files/private_messages/uploadFiles');

const {
  create,
  deleteMessageById,
} = require('../../controllers/messages');

const {
  validateCreateMessage,
} = require('../../middlewares/private_messages');

router.post('/',
  upload.fields([
    { name: 'file',
      maxCount: 1,
      fileSize: 1,
    },
  ]),
  validateCreateMessage,

  authorized,
  (req, res) => create(req, res),
);

router.delete('/',
  authorized,
  (req, res) => deleteMessageById(req, res),
);


module.exports = { messages: router };
