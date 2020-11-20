'use strict';

const { Validator } = require('jsonschema');
const v = new Validator();

const addContactSchema = {
  'id': '/addContact',
  'type': 'object',
  'properties': {
    'id': {
      'type': 'number',
      'required': true,
    },
    'displayedFirstName': {
      'type': 'string',
      'required': true,
    },
    'displayedLastName': {
      'type': 'string',
    },
  },
};
const deleteContactSchema = {
  'id': '/addContact',
  'type': 'object',
  'properties': {
    'id': {
      'type': 'number',
      'required': true,
    },
  },
};

const getContactUsernameSchema = {
  'id': '/addContact',
  'type': 'object',
  'properties': {
    'username': {
      'type': 'string',
      'required': true,
    },
  },
};

const getContactFullnameSchema = {
  'id': '/addContact',
  'type': 'object',
  'properties': {
    'fullname': {
      'type': 'string',
      'required': true,
    },
  },
};

const validateAddContact = (req, res, next) => {
  const validationResult = v.validate(req.body, addContactSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Id is required' });
  }
  return next();
};

const validateDeleteContact = (req, res, next) => {
  const validationResult = v.validate(req.body, deleteContactSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Id is required' });
  }
  return next();
};

const validateGetContactUsername = (req, res, next) => {
  const validationResult = v.validate(req.params, getContactUsernameSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Id is required' });
  }
  return next();
};
const validateGetContactFullname = (req, res, next) => {
  const validationResult = v.validate(req.params, getContactFullnameSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Id is required' });
  }
  return next();
};

module.exports = {
  validateAddContact,
  validateDeleteContact,
  validateGetContactUsername,
  validateGetContactFullname,
};
