const auth = require('./auth');
const user = require('./user');
const contacts = require('./contacts');
const privateMessages = require('./private_messages');

module.exports = {
  ...auth,
  ...user,
  ...contacts,
  ...privateMessages,
};
