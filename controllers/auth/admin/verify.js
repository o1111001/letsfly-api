const { sendError } = require('../../../helpers/responses');

const response = () => ({
  message: `Success`,
});

const verifyAdmin = async (req, res) => {
  try {
    if (req.locals && req.locals.id && req.locals.isAdmin) return res.send(response());
    throw 'Not authorized';
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = verifyAdmin;
