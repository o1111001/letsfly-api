const { responseCreator } = require('../responses');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => res
  .status(err.status || 500)
  .send(responseCreator(err.message || 'Internal server error'));
