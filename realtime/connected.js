const connectedService = require('../services/online_status/connected');

module.exports = socket => {
  const { userId } = socket;
  connectedService(userId);
  console.log(`${socket.userId} connected!`);
};
