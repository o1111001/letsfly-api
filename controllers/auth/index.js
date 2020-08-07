const signUp = require('./signup');
const login = require('./login');
const sendCode = require('./sendCode');
const verify = require('./verify');
const adminVerify = require('./adminVerify');
const adminLogin = require('./adminLogin');

module.exports = {
  signUp,
  login,
  sendCode,
  verify,
  adminLogin,
  adminVerify,
};
