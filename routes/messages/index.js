'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const { requestWrapper } = require('../../helpers/errors');

const {
  create,
  deleteMessageById,
  changePublicity,
} = require('../../controllers/messages');

const {
  validateCreateMessage,
} = require('../../validators/private_messages');

router.post('/',
  validateCreateMessage,
  authorized,
  requestWrapper(create),
);

router.delete('/',
  authorized,
  requestWrapper(deleteMessageById),
);

router.patch('/',
  authorized,
  requestWrapper(changePublicity),
);

module.exports = { messages: router };
