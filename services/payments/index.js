const PaymentsRepo = require('../../repositories/payments');

const callback = async body => {
  const { email, transactionStatus, amount, currency, orderReference, merchantSignature } = body;
  let usdAmount = amount;
  if (currency !== 'USD') {
    usdAmount = 5;
  }

  const payments = new PaymentsRepo();
  const user = await payments.checkExists(email);
  let id = -1;
  if (user.length) {
    id = user[0].id;
  }
  await payments.create(id, usdAmount, transactionStatus, orderReference, merchantSignature);
  // if (transactionStatus === 'Approved' && id !== -1) {
  // const balance = await payments.checkBalance(id);
  // if (!balance.length) {
  //   await payments.createBalance(id);
  // }
  // await payments.add(id, usdAmount);
  // }
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
