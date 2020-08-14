'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  callback,
  balance,
} = require('../../controllers');

router.post('/callback',
  (req, res) => callback(req, res),
);

router.get('/balance',
  authorized,
  (req, res) => balance(req, res),
);

module.exports = router;
