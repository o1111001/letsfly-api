const WithdrawalsRepo = require('../repositories');
const { CustomError } = require('../../../helpers/errors');

const changeStatus = async (id, status) => {
  const withdrawals = new WithdrawalsRepo();
  const request = await withdrawals.get(id);
  const balance = await withdrawals.getBalance(request.userId);
  if (request.amount > balance.balance) {
    throw new CustomError('Insufficient funds', 422);
  }

  const updated = await withdrawals.updateStatus(id, status);
  return updated;
};

const withdrawsFullList = async () => {
  const withdrawals = new WithdrawalsRepo();
  const updated = await withdrawals.fullList();
  return updated;
};

module.exports = {
  changeStatus,
  withdrawsFullList,
};
