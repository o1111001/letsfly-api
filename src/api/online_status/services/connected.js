const OnlineStatusRepo = require('../repositories');

module.exports = userId => {
  const onlineStatus = new OnlineStatusRepo(userId);
  onlineStatus.online();
};

