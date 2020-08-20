const auth = require('./auth');
const admin = require('./admin');
const user = require('./user');
const contacts = require('./contacts');
const privateMessages = require('./message');

module.exports = {
  ...auth,
  ...user,
  ...contacts,
  ...privateMessages,
  ...admin,
};
