const ws = require('ws');

module.exports = server => {
  const wsI = ws(server);
  global.wsI = wsI;
};
