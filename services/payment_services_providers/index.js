const PaymentsRepo = require('../../repositories/payments');

const wpfCallback = async body => {
  const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
  const usdAmount = amount;

  const payments = new PaymentsRepo();
  const user = await payments.checkExists(email);
  const id = user.length ? user[0].id : -1;

  await payments.create({ userId: id, amount: usdAmount, status: transactionStatus, orderReference, signature: merchantSignature });
  return;
};

module.exports = {
  wpfCallback,
};
