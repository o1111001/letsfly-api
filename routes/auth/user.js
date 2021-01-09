'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const authorizedRefresh = require('../../policies/authorizedRefresh');

const { requestWrapper } = require('../../helpers/errors');

const {
  signUp,
  login,
  sendCode,
  verify,
  refresh,
  logout,
} = require('../../controllers/auth/user');

const {
  signUp: {
    validateSignUp,
  },
  login: {
    validateEmail,
    validateCode,
  },
} = require('../../validators/auth');

router.post('/signup',
  validateSignUp,
  requestWrapper(signUp),
);

router.post('/login',
  validateCode,
  login,
);

router.post('/refresh',
  authorizedRefresh,
  refresh,
);

router.post('/login/code',
  validateEmail,
  requestWrapper(sendCode),
);

router.get('/verify',
  authorized,
  requestWrapper(verify),
);

router.post('/logout',
  logout,
);

module.exports = router;
