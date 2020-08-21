'use strict';

const express = require('express');
const router = express.Router();

const {
  getFile,
} = require('../../controllers/files');

const {
  checkFolder,
} = require('../../middlewares/files');

router.get('/:main/:folder/:filename',
  checkFolder,
  // authorized,
  (req, res) => getFile(req, res),
);

module.exports = router;
