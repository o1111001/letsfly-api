'use strict';

const express = require('express');
const app = express();

const server = require('http').Server(app);
const {
  PORT,
  CORS_WHITELIST,
} = require('./config/env');

global.basedir = __dirname;
require('./config/db');
require('./config/socket')(server);
require('./realtime');

const { join } = require('path');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const {
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
} = require('./routes');

const { globalErrorHandler } = require('./helpers/errors');

const whitelist = CORS_WHITELIST.split(',');
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());


// regular routes
app.use('*', (req, res, next) => { console.log(req.method, req.originalUrl, req.body); return next(); });

app.get('/', (req, res) => res.send('Success'));
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/users', usersBioRoutes);
app.use('/api/v1/users/find', usersFindRoutes);
app.use('/api/v1/users/ban', usersBanRoutes);

app.use('/api/v1/chats', chatsRoutes);
app.use('/api/v1/chats/personal', personalChatsRoutes);
app.use('/api/v1/chats/group', groupChatsRoutes);
app.use('/api/v1/chats/group/memberships', membershipsRoutes);

app.use('/api/v1/contacts', contactsRoutes);
app.use('/api/v1/contacts/find', contactsFindRoutes);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/withdraw', withdrawsRoutes);

// admin routes
app.use('/api/v1/admin/auth', authAdminRoutes);
app.use('/api/v1/admin/withdraw', withdrawsAdminRoutes);
app.use('/api/v1/admin/analytics', analyticsAdminRoutes);

// payment services routes
app.use('/api/v1/payment_services_provider', paymentServicesProvider);

// static files routes
app.use('/files', filesRoutes);
// app.use('/admin/analytics', analyticsAdminRoutes);


// -- need to be moved to cdn
const frontendBuild = join(__dirname, 'build');
app.use(express.static(frontendBuild));
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: frontendBuild });
});

// global error handler
app.use(globalErrorHandler);

server.listen(PORT,
  () => console.log(`Server listening on ${PORT} port`));
