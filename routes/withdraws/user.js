'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const { requestWrapper } = require('../../helpers/errors');

const {
  create,
  withdrawsList,
} = require('../../controllers/withdraws/user');

router.post('/',
  authorized,
  requestWrapper(create),
);

router.get('/list',
  authorized,
  requestWrapper(withdrawsList),
);

module.exports = router;
