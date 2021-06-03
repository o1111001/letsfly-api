'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const { requestWrapper } = require('../../../helpers/errors');

const {
  ban: {
    banUser,
    unBanUser,
  },
} = require('../controllers');

router.put('/',
  authorized,
  requestWrapper(banUser),
);

router.delete('/',
  authorized,
  requestWrapper(unBanUser),
);

module.exports = router;
