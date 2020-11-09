const payments = require('../../repositories/payments');
const WithdrawalsRepo = require('../../repositories/withdrawals');
const { CustomError } = require('../../helpers/errors');

const create = async (id, amount, cardNumber, comment) => {
  const balance = await payments.checkBalance(id);
  if (!balance || balance.balance < amount) {
    // throw new CustomError('Insufficient funds', 505);
  }
  const withdrawals = new WithdrawalsRepo();
  const data = await withdrawals.create(id, amount, cardNumber, comment);
  console.log(data);
  return;
};

const withdrawsList = async id => {
  const withdrawals = new WithdrawalsRepo();
  const updated = await withdrawals.list(id);
  return updated;
};

const historyList = id => {
  const withdrawals = new WithdrawalsRepo();
  return withdrawals.fullUserHistory(id);
};

module.exports = {
  create,
  withdrawsList,
  historyList,
};
