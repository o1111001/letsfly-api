'use strict';

const express = require('express');
const router = express.Router();
const { requestFileWrapper } = require('../../helpers/errors');

const {
  getFile,
} = require('../../controllers/files');

const {
  checkFolder,
} = require('../../middlewares/files');

router.get('/:main/:folder/:filename',
  checkFolder,
  // authorized,
  requestFileWrapper(getFile),
);

module.exports = router;
