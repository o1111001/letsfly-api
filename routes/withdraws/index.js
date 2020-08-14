'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');
const isAdmin = require('../../policies/isAdmin');

const {
  withdraw,
  withdrawStatus,
  withdrawsList,
  withdrawsFullList,
} = require('../../controllers');

router.post('/',
  authorized,
  (req, res) => withdraw(req, res),
);

router.get('/list',
  authorized,
  (req, res) => withdrawsList(req, res),
);

// ADMIN

router.get('/admin/list',
  authorized,
  isAdmin,
  (req, res) => withdrawsFullList(req, res),
);

router.put('/admin/status',
  authorized,
  isAdmin,
  (req, res) => withdrawStatus(req, res),
);

module.exports = router;
