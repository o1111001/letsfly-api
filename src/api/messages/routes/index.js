'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');

const { requestWrapper } = require('../../../helpers/errors');

const {
  create,
  deleteMessageById,
  changePublicity,
} = require('../controllers');

router.post('/',
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
