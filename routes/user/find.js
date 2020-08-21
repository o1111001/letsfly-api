'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  find: {
    findName,
    findUsername,
  },
} = require('../../controllers/user');

router.get('/name/:name',
  authorized,
  (req, res) => findName(req, res),
);

router.get('/username/:name',
  authorized,
  (req, res) => findUsername(req, res),
);

module.exports = router;
