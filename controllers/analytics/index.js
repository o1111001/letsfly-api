
const {
  analytics: analyticsService,
} = require('../../services/analytics');
const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const analytics = async (req, res) => {
  try {
    const data = await analyticsService();
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  analytics,
};


