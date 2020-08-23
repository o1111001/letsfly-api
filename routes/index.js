const {
  admin: analyticsAdminRoutes,
} = require('./analytics');

const {
  admin: authAdminRoutes,
  user: authRoutes,
} = require('./auth');

const {
  contacts: contactsRoutes,
  find: contactsFindRoutes,
} = require('./contacts');

const {
  chats: chatsRoutes,
  personal: personalChatsRoutes,
} = require('./chats');

const {
  messages: messagesRoutes,
} = require('./messages');

const {
  bio: usersBioRoutes,
  ban: usersBanRoutes,
  find: usersFindRoutes,
} = require('./user');

const {
  admin: withdrawsAdminRoutes,
  user: withdrawsRoutes,
} = require('./withdraws');

const paymentServicesProvider = require('./payment_services_provider');

const filesRoutes = require('./files');

module.exports = {
  analyticsAdminRoutes,
  authAdminRoutes,
  authRoutes,
  contactsRoutes,
  contactsFindRoutes,
  chatsRoutes,
  personalChatsRoutes,
  messagesRoutes,
  usersBioRoutes,
  usersBanRoutes,
  usersFindRoutes,
  withdrawsAdminRoutes,
  withdrawsRoutes,
  paymentServicesProvider,
  filesRoutes,
};
