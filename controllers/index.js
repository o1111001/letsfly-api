const auth = require('./auth');
const user = require('./user');
const contacts = require('./contacts');
const files = require('./files');

module.exports = {
  ...auth,
  ...user,
  ...contacts,
  ...files,
};
