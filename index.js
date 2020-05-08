'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const {
  PORT,
} = require('./config/env');

require('./config/db');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/user');

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.disable('x-powered-by');


app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.listen(PORT,
  () => console.log(`Server listening on ${PORT} port`));
