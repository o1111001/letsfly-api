
const {
  wpfCallback: wpfCallbackService,
} = require('../../services/payment_services_providers');

const response = data => ({
  message: `Success`,
  data,
});

const wpfCallback = async req => {
  const body = JSON.parse(Object.keys(req.body)[0]);
  // const body = req.body;
  const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
  const result = wpfCallbackService({ email, transactionStatus, amount, currency, orderReference, merchantSignature });
  return response(result);
};

module.exports = {
  wpfCallback,
};
