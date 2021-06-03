
const {
  analytics: analyticsService,
} = require('../services');

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


