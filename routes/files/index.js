'use strict';

const express = require('express');
const router = express.Router();
const { requestWrapper } = require('../../helpers/errors');
const authorized = require('../../policies/authorized');

const {
  getPreSignedUrl,
} = require('../../controllers/files');

const {
  checkDirectory,
} = require('../../validators/files');

// get pre-signed url
router.get('/',
  // checkDirectory,
  authorized,
  requestWrapper(getPreSignedUrl),
);

module.exports = router;
