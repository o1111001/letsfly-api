'use strict';

const express = require('express');
const router = express.Router();

const {
  wfpCallback,
} = require('../../controllers/payment_services_providers');

router.post('/way_for_pay/callback',
  (req, res) => wfpCallback(req, res),
);

module.exports = router;
