
const {
  analytics: analyticsService,
} = require('../../services/analytics');

const response = data => ({
  message: `Success`,
  data,
});

const analytics = async () => {
  const data = await analyticsService();
  return response(data);
};

module.exports = {
  analytics,
};


