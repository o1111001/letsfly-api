'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  ban: {
    banUser,
    unBanUser,
  },
} = require('../../controllers/user');

router.put('/',
  authorized,
  (req, res) => banUser(req, res),
);

router.delete('/',
  authorized,
  (req, res) => unBanUser(req, res),
);

module.exports = router;
