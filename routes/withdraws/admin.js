'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const isAdmin = require('../../policies/isAdmin');

const {
  changeWithdrawStatus,
  withdrawsFullList,
} = require('../../controllers/withdraws/admin');

router.get('/list',
  authorized,
  isAdmin,
  (req, res) => withdrawsFullList(req, res),
);

router.put('/status',
  authorized,
  isAdmin,
  (req, res) => changeWithdrawStatus(req, res),
);

module.exports = router;
