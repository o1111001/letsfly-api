'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const { requestWrapper } = require('../../helpers/errors');

const {
  signUp,
  login,
  sendCode,
  verify,
} = require('../../controllers/auth/user');

const {
  signUp: {
    validateSignUp,
  },
  login: {
    validateEmail,
    validateCode,
  },
} = require('../../middlewares/auth');

router.post('/signup',
  validateSignUp,
  requestWrapper(signUp),
);

router.post('/login',
  validateCode,
  requestWrapper(login),
);

router.post('/login/code',
  validateEmail,
  requestWrapper(sendCode),
);

router.get('/verify',
  authorized,
  requestWrapper(verify),
);

module.exports = router;
