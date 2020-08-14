const AnalyticsRepo = require('../../repositories/analytics');

const analytics = async () => {
  const analytics = new AnalyticsRepo();
  const result = await analytics.get();
  return result;
};
module.exports = {
  analytics,
};
