'use strict';

const express = require('express');
const app = express();

const server = require('http').Server(app);
global.basedir = __dirname;
require('./config/db');

const { PORT } = require('./config/env');
const { REDIS_HOST, REDIS_PORT } = require('./config/redis');

const authorizedSocket = require('./policies/authorizedSocket');
const io = require('socket.io')(server);
const redis = require('socket.io-redis');
io.adapter(redis({ host: REDIS_HOST, port: REDIS_PORT }));
io.use(authorizedSocket);
global.io = io;
require('./realtime');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const {
  admin: analyticsAdminRoutes,
} = require('./routes/analytics');

const {
  admin: authAdminRoutes,
  user: authRoutes,
} = require('./routes/auth');

const {
  contacts: contactsRoutes,
  find: contactsFindRoutes,
} = require('./routes/contacts');

const {
  chats: chatsRoutes,
  personal: personalChatsRoutes,
} = require('./routes/chats');

const {
  messages: messagesRoutes,
} = require('./routes/messages');

const {
  bio: usersBioRoutes,
  ban: usersBanRoutes,
  find: usersFindRoutes,
} = require('./routes/user');

const {
  admin: withdrawsAdminRoutes,
  user: withdrawsRoutes,
} = require('./routes/withdraws');

// payment providers routes
const paymentServicesProvider = require('./routes/payment_services_provider');

// static files routes
const filesRoutes = require('./routes/files');
const frontendBuild = require('path').join(__dirname, 'build');

app.use((req, res, next) => { console.log(req.method, req.url); return next(); }); //need to implement logger
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

// regular routes
app.get('/api/health', (req, res) => res.send('Success'));
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/users', usersBioRoutes);
app.use('/api/v1/users/find', usersFindRoutes);
app.use('/api/v1/users/ban', usersBanRoutes);

app.use('/api/v1/chats', chatsRoutes);
app.use('/api/v1/chats/personal', personalChatsRoutes);

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

app.use(express.static(frontendBuild));
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: frontendBuild });
});

server.listen(PORT,
  () => console.log(`Server listening on ${PORT} port`));
