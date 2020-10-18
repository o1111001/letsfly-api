
const {
  getUser: getUserService,
  callback: callbackService,
  getSignature: getSignatureService,
  getPaymentURL: getPaymentURLService,
  createPayment: createPaymentService,
  getSignatureOnPayment: getSignatureOnPaymentService
} = require('../../services/payment_services_providers');

const {
  CustomError,
} = require('../../helpers/errors');

const response = data => ({
  message: `Success`,
  data,
});

const wfpGetPaymentUrl = async req => {
  const {
    amount,
  } = req.body;
  const { id } = req.locals;
  const { email, phone } = await getUserService(id);

  const [merchantSignature, orderReference, orderDate] = getSignatureService(amount);
  const [url] = await Promise.all([
    getPaymentURLService(amount, { merchantSignature, orderReference, orderDate }, { email, phone }),
    createPaymentService({
      order: orderReference,
      signature: merchantSignature,
      userId: id,
      amount,
      status: 'created',
    }),
  ]);
  return response(url);
};

const wfpCallback = async req => {
  const body = JSON.parse(Object.keys(req.body)[0]);
  const generatedSignature = getSignatureOnPaymentService(body);
  const { transactionStatus, orderReference, merchantSignature } = body;
  if (generatedSignature !== merchantSignature) throw new CustomError(409, 'Wrong signature');

  const result = await callbackService({ transactionStatus, orderReference, merchantSignature });
  return result;
};

module.exports = {
  wfpCallback,
  wfpGetPaymentUrl,
};
