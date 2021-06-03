'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const isAdmin = require('../../../policies/isAdmin');
const { requestWrapper } = require('../../../helpers/errors');

const {
  changeWithdrawStatus,
  withdrawsFullList,
} = require('../controllers');

router.get('/list',
  authorized,
  isAdmin,
  requestWrapper(withdrawsFullList),
);

router.put('/status',
  authorized,
  isAdmin,
  requestWrapper(changeWithdrawStatus),
);

module.exports = router;
