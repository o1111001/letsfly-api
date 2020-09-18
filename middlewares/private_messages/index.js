const { Validator } = require('jsonschema');
const v = new Validator();

const createMessageSchema = {
  'id': '/createMessage',
  'type': 'object',
  'properties': {
    'type': {
      'type': 'string',
      'required': true,
    },
    'text': {
      'type': 'string',
    },
    'receiverId': {
      'type': 'string',
    },
    'chatId': {
      'type': 'string',
    },
  },
};

const validateCreateMessage = (req, res, next) => {
  const validationResult = v.validate(req.body, createMessageSchema);
  if (validationResult.errors.length) {
    return res.status(422).send({ message: 'Wrong parameters' });
  }
  return next();
};

module.exports = {
  validateCreateMessage,
};
