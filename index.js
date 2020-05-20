'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {
  PORT,
} = require('./config/env');

global.basedir = __dirname;
require('./config/db');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/user');
const contactsRoutes = require('./routes/contact');
const filesRoutes = require('./routes/files');

var whitelist = ['http://localhost:3000']
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,

}

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());
app.disable('x-powered-by');


app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

app.get('/api/health', (req, res) => res.send('Success'));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/contacts', contactsRoutes);
app.use('/files', filesRoutes);

app.listen(PORT,
  () => console.log(`Server listening on ${PORT} port`));
