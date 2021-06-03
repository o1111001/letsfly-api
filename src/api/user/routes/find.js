'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const { requestWrapper } = require('../../../helpers/errors');

const {
  find: {
    findName,
    findUsername,
  },
} = require('../controllers');

router.get('/name/:name',
  authorized,
  requestWrapper(findName),
);

router.get('/username/:name',
  authorized,
  requestWrapper(findUsername),
);

module.exports = router;
