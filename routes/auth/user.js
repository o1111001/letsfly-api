'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

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
  (req, res) => signUp(req, res),
);

router.post('/login',
  validateCode,
  (req, res) => login(req, res),
);

router.post('/login/code',
  validateEmail,
  (req, res) => sendCode(req, res),
);

router.get('/verify',
  authorized,
  (req, res) => verify(req, res),
);

module.exports = router;
