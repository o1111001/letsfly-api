const { sendError } = require('../../helpers/responses');

const response = () => ({
  message: `Success`,
});

const verify = async (req, res) => {
  try {
    if (req.locals && req.locals.id) return res.send(response());
    throw 'Not authorized';
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = verify;
