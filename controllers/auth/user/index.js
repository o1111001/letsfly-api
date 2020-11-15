const signUp = require('./signup');
const login = require('./login');
const sendCode = require('./sendCode');
const verify = require('./verify');
const refresh = require('./refresh');
const logout = require('./logout');
module.exports = {
  signUp,
  login,
  sendCode,
  verify,
  refresh,
  logout,
};
