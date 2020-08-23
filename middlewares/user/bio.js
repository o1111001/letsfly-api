'use strict';

const { Validator } = require('jsonschema');
const v = new Validator();

// eslint-disable-next-line no-useless-escape
const phoneNumberPattern = /^((\+[(]?[0-9]{1,3}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})$/;

const validateGetBio = (req, res, next) => {
  if (req.params.id && (req.params.id === 'me' || Number.isInteger(parseInt(req.params.id, 10)))) {
    return next();
  }
  return res.status(422).send({ message: 'Wrong format' });
};

const usernameSchema = {
  'id': '/login',
  'type': 'object',
  'properties': {
    'username': {
      'type': 'string',
      'required': true,
    },
  },
};

const phoneNumberSchema = {
  'id': '/login',
  'type': 'object',
  'properties': {
    'phone': {
      'type': 'string',
      'pattern': phoneNumberPattern,
      'required': true,
    },
  },
};

const firstNameSchema = {
  'id': '/login',
  'type': 'object',
  'properties': {
    'firstName': {
      'type': 'string',
      'required': true,
    },
  },
};

const lastNameSchema = {
  'id': '/login',
  'type': 'object',
  'properties': {
    'lastName': {
      'type': 'string',
      'required': true,
    },
  },
};

const aboutSchema = {
  'id': '/login',
  'type': 'object',
  'properties': {
    'about': {
      'type': 'string',
      'required': true,
      'maxLength': 80,
    },
  },
};

const validateUsername = (req, res, next) => {
  const validationResult = v.validate(req.body, usernameSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Username is required' });
  }
  return next();
};

const validatePhoneNumber = (req, res, next) => {
  const validationResult = v.validate(req.body, phoneNumberSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Wrong phone number format' });
  }
  return next();
};

const validateFirstName = (req, res, next) => {
  const validationResult = v.validate(req.body, firstNameSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'firstName field is required' });
  }
  return next();
};

const validateLastName = (req, res, next) => {
  const validationResult = v.validate(req.body, lastNameSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'lastName field is required' });
  }
  return next();
};

const validateAbout = (req, res, next) => {
  const validationResult = v.validate(req.body, aboutSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Wrong about field format' });
  }
  return next();
};

const validateAvatar = (req, res, next) => {
  if (req.headers['content-type']) {
    const verifyType = req.headers['content-type'].split('=')[0];
    if (verifyType === 'multipart/form-data; boundary') {
      return next();
    } else {
      return res.status(422).send({
        message: 'Wrong type',
      });
    }
  } else {
    return res.status(422).send({
      message: 'Wrong type',
    });
  }
};

module.exports = {
  validateGetBio,
  validateUsername,
  validatePhoneNumber,
  validateFirstName,
  validateLastName,
  validateAbout,
  validateAvatar,
};
