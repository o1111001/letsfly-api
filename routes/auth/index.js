'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const isAdmin = require('../../policies/isAdmin');

const {
  signUp,
  login,
  adminLogin,
  sendCode,
  verify,
  adminVerify,
} = require('../../controllers');

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

router.post('/admin/login',
  authorized,
  (req, res) => adminLogin(req, res),
);

router.get('/admin/verify',
  authorized,
  isAdmin,
  (req, res) => adminVerify(req, res),
);

module.exports = router;
