'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const isAdmin = require('../../../policies/isAdmin');
const { requestWrapper } = require('../../../helpers/errors');

const {
  analytics,
} = require('../controllers/admin');

router.get('/',
  authorized,
  isAdmin,
  requestWrapper(analytics),
);

module.exports = router;
