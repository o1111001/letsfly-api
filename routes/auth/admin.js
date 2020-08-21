'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const isAdmin = require('../../policies/isAdmin');

const {
  login,
  verify,
} = require('../../controllers/auth/admin');

router.post('/login',
  authorized,
  (req, res) => login(req, res),
);

router.get('/verify',
  authorized,
  isAdmin,
  (req, res) => verify(req, res),
);

module.exports = router;
