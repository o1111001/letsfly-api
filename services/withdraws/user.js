const PaymentsRepo = require('../../repositories/payments');
const WithdrawalsRepo = require('../../repositories/withdrawals');

const create = async (id, amount, cardNumber, comment) => {
  const payments = new PaymentsRepo();
  const balance = await payments.checkBalance(id);
  if (!balance || balance.balance < amount) {
    throw 'Insufficient funds';
  }
  const withdrawals = new WithdrawalsRepo();
  await withdrawals.create(id, amount, cardNumber, comment);
  return;
};

const withdrawsList = async id => {
  const withdrawals = new WithdrawalsRepo();
  const updated = await withdrawals.list(id);
  return updated;
};


module.exports = {
  create,
  withdrawsList,
};
