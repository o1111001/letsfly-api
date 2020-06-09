const auth = require('./auth');
const user = require('./user');
const contacts = require('./contacts');
const files = require('./files');
const privateMessages = require('./private_messages');
module.exports = {
  ...auth,
  ...user,
  ...contacts,
  ...files,
  ...privateMessages,
};
