'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const upload = require('../../services/files/private_messages/uploadFiles');
const { requestWrapper } = require('../../helpers/errors');

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
  requestWrapper(create),
);

router.delete('/',
  authorized,
  requestWrapper(deleteMessageById),
);


module.exports = { messages: router };
