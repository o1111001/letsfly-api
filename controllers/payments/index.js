
const {
  callback: callbackService,
  balance: balanceService,
} = require('../../services/payments');
const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const callback = async (req, res) => {
  try {
    const body = JSON.parse(Object.keys(req.body)[0]);
    // const body = req.body;
    const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
    const result = callbackService({ email, transactionStatus, amount, currency, orderReference, merchantSignature });
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};

const balance = async (req, res) => {
  try {
    const { id } = req.locals;
    const data = await balanceService(id);
    return res.send(response(data));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  callback,
  balance,
};

