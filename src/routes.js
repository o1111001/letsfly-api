const {
  admin: analyticsAdminRoutes,
} = require('./api/analytics/routes');

const {
  admin: authAdminRoutes,
  user: authRoutes,
} = require('./api/auth/routes');

const {
  contacts: contactsRoutes,
  find: contactsFindRoutes,
} = require('./api/contacts/routes');

const {
  chats: chatsRoutes,
  personal: personalChatsRoutes,
  group: groupChatsRoutes,
} = require('./api/chats/routes');

const {
  memberships: membershipsRoutes,
} = require('./api/memberships/routes');

const {
  messages: messagesRoutes,
} = require('./api/messages/routes');

const {
  bio: usersBioRoutes,
  ban: usersBanRoutes,
  find: usersFindRoutes,
} = require('./api/user/routes');

const {
  admin: withdrawsAdminRoutes,
  user: withdrawsRoutes,
} = require('./api/withdraws/routes');

const paymentServicesProvider = require('./api/payment_services_providers/routes');

const filesRoutes = require('./api/files/routes');

module.exports = {
  analyticsAdminRoutes,
  authAdminRoutes,
  authRoutes,
  contactsRoutes,
  contactsFindRoutes,
  chatsRoutes,
  personalChatsRoutes,
  groupChatsRoutes,
  membershipsRoutes,
  messagesRoutes,
  usersBioRoutes,
  usersBanRoutes,
  usersFindRoutes,
  withdrawsAdminRoutes,
  withdrawsRoutes,
  paymentServicesProvider,
  filesRoutes,
};
