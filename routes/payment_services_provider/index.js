'use strict';

const express = require('express');
const router = express.Router();
const { requestWrapper } = require('../../helpers/errors');
const authorized = require('../../policies/authorized');

const {
  wfpCallback,
  wfpGetPaymentUrl,
} = require('../../controllers/payment_services_providers');

router.post('/way_for_pay/callback',
  requestWrapper(wfpCallback),
);

router.post('/way_for_pay/payment_link',
  authorized,
  requestWrapper(wfpGetPaymentUrl),
);

module.exports = router;
