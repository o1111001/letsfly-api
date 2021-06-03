const AnalyticsRepo = require('../repositories');

const analytics = async () => {
  const analytics = new AnalyticsRepo();
  const result = await analytics.get();
  return result;
};
module.exports = {
  analytics,
};
