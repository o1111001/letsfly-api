
const {
  wfpCallback: wfpCallbackService,
} = require('../../services/payment_services_providers');

const response = data => ({
  message: `Success`,
  data,
});

const wfpCallback = async req => {
  const body = JSON.parse(Object.keys(req.body)[0]);
  // const body = req.body;
  const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
  const result = wfpCallbackService({ email, transactionStatus, amount, currency, orderReference, merchantSignature });
  return response(result);
};

module.exports = {
  wfpCallback,
};
