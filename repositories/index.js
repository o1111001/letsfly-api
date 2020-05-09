const auth = require('./auth');
const user = require('./user');
const contacts = require('./contacts');

module.exports = {
  ...auth,
  ...user,
  ...contacts,
};
