'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../policies/authorized');

const {
  bio: {
    getBio,
    updateUsername,
    updatePhoneNumber,
    updateFirstName,
    updateLastName,
    updateAbout,
    updateAvatar,
    updateFullBio,
  },
  user: {
    banUser,
    unBanUser,
    findName,
    findUsername,
  },
} = require('../../controllers');

const {
  bio: {
    validateGetBio,
    validateUsername,
    validatePhoneNumber,
    validateFirstName,
    validateLastName,
    validateAbout,
    validateAvatar,
  },
} = require('../../middlewares/user');

const { upload } = require('../../services/files');

router.get('/bio/:id',
  validateGetBio,
  authorized,
  (req, res) => getBio(req, res),
);

router.get('/find/name/:name',
  authorized,
  (req, res) => findName(req, res),
);

router.get('/find/username/:name',
  authorized,
  (req, res) => findUsername(req, res),
);

router.put('/bio/full',
  authorized,
  (req, res) => updateFullBio(req, res),
);

router.put('/bio/username',
  validateUsername,
  authorized,
  (req, res) => updateUsername(req, res),
);

router.put('/bio/phone_number',
  validatePhoneNumber,
  authorized,
  (req, res) => updatePhoneNumber(req, res),
);

router.put('/bio/first_name',
  validateFirstName,
  authorized,
  (req, res) => updateFirstName(req, res),
);

router.put('/bio/last_name',
  validateLastName,
  authorized,
  (req, res) => updateLastName(req, res),
);

router.put('/bio/about',
  validateAbout,
  authorized,
  (req, res) => updateAbout(req, res),
);

router.put('/bio/avatar',
  validateAvatar,
  authorized,
  upload('avatars').single('avatar'),
  (req, res) => updateAvatar(req, res),
);

router.put('/ban',
  authorized,
  (req, res) => banUser(req, res),
);

router.delete('/ban',
  authorized,
  (req, res) => unBanUser(req, res),
);

module.exports = router;
