'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  create,
  withdrawsList,
} = require('../../controllers/withdraws/user');

router.post('/',
  authorized,
  (req, res) => create(req, res),
);

router.get('/list',
  authorized,
  (req, res) => withdrawsList(req, res),
);

module.exports = router;
