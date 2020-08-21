'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const isAdmin = require('../../policies/isAdmin');

const {
  analytics,
} = require('../../controllers/analytics/admin');

router.get('/',
  authorized,
  isAdmin,
  (req, res) => analytics(req, res),
);

module.exports = router;
