'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const isAdmin = require('../../policies/isAdmin');
const { requestWrapper } = require('../../helpers/errors');

const {
  login,
  verify,
} = require('../../controllers/auth/admin');

router.post('/login',
  authorized,
  requestWrapper(login),
);

router.get('/verify',
  authorized,
  isAdmin,
  requestWrapper(verify),
);

module.exports = router;
