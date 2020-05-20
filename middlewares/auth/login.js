/* eslint-disable no-useless-escape */
'use strict';

const { Validator } = require('jsonschema');
const v = new Validator();

const emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

const loginSchema = {
  'id': '/login',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'pattern': emailPattern,
      'required': true,
    },
  },
};

const codeSchema = {
  'id': '/code',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'pattern': emailPattern,
      'required': true,
    },
    'code': {
      'type': 'string',
      'length': 6,
      'required': true,
    },
  },
};

const validateEmail = (req, res, next) => {
  const validationResult = v.validate(req.body, loginSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Wrong email' });
  }
  return next();
};

const validateCode = (req, res, next) => {
  const validationResult = v.validate(req.body, codeSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Wrong code' });
  }
  return next();
};

module.exports = {
  validateEmail,
  validateCode,
};
