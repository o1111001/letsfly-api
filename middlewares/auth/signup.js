/* eslint-disable no-useless-escape */
'use strict';

const { Validator } = require('jsonschema');
const v = new Validator();

const emailPattern = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';

const signUpSchema = {
  'id': '/signUp',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'pattern': emailPattern,
      'required': true,
    },
  },
};

const validateSignUp = (req, res, next) => {
  const validationResult = v.validate(req.body, signUpSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Wrong email' });
  }
  return next();
};

module.exports = {
  validateSignUp,
};
