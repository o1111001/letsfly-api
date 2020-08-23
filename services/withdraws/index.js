const PaymentsRepo = require('../../repositories/payments');
const WithdrawalsRepo = require('../../repositories/withdrawals');
const { CustomError } = require('../../helpers/errors');

const withdraw = async (id, amount, cardNumber, comment) => {
  const payments = new PaymentsRepo();
  const balance = await payments.checkBalance(id);
  if (!balance || balance.balance < amount) {
    throw new CustomError('Insufficient funds', 505);
  }
  const withdrawals = new WithdrawalsRepo();
  await withdrawals.create(id, amount, cardNumber, comment);
  return;
};

const changeStatus = async (id, status) => {
  const withdrawals = new WithdrawalsRepo();
  const request = await withdrawals.get(id);
  const balance = await withdrawals.getBalance(request.userId);
  if (request.amount > balance.balance) {
    throw new CustomError('Insufficient funds', 505);
  }

  const updated = await withdrawals.updateStatus(id, status);

  return updated;
};

const withdrawsList = async id => {
  const withdrawals = new WithdrawalsRepo();
  const updated = await withdrawals.list(id);
  return updated;
};

const withdrawsFullList = async () => {
  const withdrawals = new WithdrawalsRepo();
  const updated = await withdrawals.fullList();
  return updated;
};

module.exports = {
  withdraw,
  changeStatus,
  withdrawsList,
  withdrawsFullList,
};
