const PaymentsRepo = require('../../repositories/payments');

const callback = async body => {
  const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
  const usdAmount = amount;

  const payments = new PaymentsRepo();
  const user = await payments.checkExists(email);
  const id = user.length ? user[0].id : -1;
  await payments.create(id, usdAmount, transactionStatus, orderReference, merchantSignature);
  return;
};

const balance = async id => {
  const payments = new PaymentsRepo();
  const result = await payments.checkBalance(id);
  return result;
};

module.exports = {
  callback,
  balance,
};
