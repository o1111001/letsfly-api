'use strict';

const express = require('express');
const router = express.Router();
const { requestWrapper } = require('../../helpers/errors');

const {
  wfpCallback,
} = require('../../controllers/payment_services_providers');

router.post('/way_for_pay/callback',
  requestWrapper(wfpCallback),
);

module.exports = router;
