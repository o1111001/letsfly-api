const auth = require('./auth');
const user = require('./user');
const contacts = require('./contacts');
const files = require('./files');
const privateMessages = require('./private_messages');
const payments = require('./payments');
const withdraws = require('./withdraws');
const analytics = require('./analytics');

module.exports = {
  ...auth,
  ...user,
  ...contacts,
  ...files,
  ...privateMessages,
  ...payments,
  ...withdraws,
  ...analytics,
};
