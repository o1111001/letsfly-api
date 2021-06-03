'use strict';

const express = require('express');
const router = express.Router();

const authorized = require('../../../policies/authorized');
const { requestWrapper } = require('../../../helpers/errors');

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
} = require('../controllers');

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
} = require('../validators');


router.get('/bio/:id',
  validateGetBio,
  authorized,
  requestWrapper(getBio),
);

router.put('/bio/full',
  authorized,
  requestWrapper(updateFullBio),
);

router.put('/bio/username',
  validateUsername,
  authorized,
  requestWrapper(updateUsername),
);

router.put('/bio/phone_number',
  validatePhoneNumber,
  authorized,
  requestWrapper(updatePhoneNumber),
);

router.put('/bio/first_name',
  validateFirstName,
  authorized,
  requestWrapper(updateFirstName),
);

router.put('/bio/last_name',
  validateLastName,
  authorized,
  requestWrapper(updateLastName),
);

router.put('/bio/about',
  validateAbout,
  authorized,
  requestWrapper(updateAbout),
);

router.put('/bio/avatar',
  validateAvatar,
  authorized,
  // upload('avatars').single('avatar'),
  requestWrapper(updateAvatar),
);

module.exports = router;
