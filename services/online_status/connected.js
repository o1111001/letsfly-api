const OnlineStatusRepo = require('../../repositories/online_status');

module.exports = userId => {
  const onlineStatus = new OnlineStatusRepo(userId);
  onlineStatus.online();
};

