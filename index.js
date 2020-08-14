'use strict';

const express = require('express');
const app = express();

// eslint-disable-next-line new-cap
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

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/user');
const contactsRoutes = require('./routes/contact');
const messagesRoutes = require('./routes/private_messages');
const paymentsRoutes = require('./routes/payments');
const withdrawsRoutes = require('./routes/withdraws');
const analyticsRoutes = require('./routes/analytics');

const filesRoutes = require('./routes/files');
app.use((req, res, next) => { console.log(req.method, req.url); return next(); });
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

app.get('/api/health', (req, res) => res.send('Success'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/contacts', contactsRoutes);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/withdraw', withdrawsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use('/files', filesRoutes);


const root = require('path').join(__dirname, 'build');
app.use(express.static(root));
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root });
});

server.listen(PORT,
  () => console.log(`Server listening on ${PORT} port`));
