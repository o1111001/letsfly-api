
const {
  wpfCallback: wpfCallbackService,
} = require('../../services/payment_services_providers');

const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const wpfCallback = async (req, res) => {
  try {
    const body = JSON.parse(Object.keys(req.body)[0]);
    // const body = req.body;
    const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
    const result = wpfCallbackService({ email, transactionStatus, amount, currency, orderReference, merchantSignature });
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  wpfCallback,
};
