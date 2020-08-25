
const {
  create: createWithdrawService,
  withdrawsList: withdrawsListService,
} = require('../../services/withdraws/user');

const response = data => ({
  message: `Success`,
  data,
});

const create = async req => {
  const { id } = req.locals;
  const { amount, cardNumber, comment } = req.body;
  const result = await createWithdrawService(id, amount, cardNumber, comment);
  return response(result);
};

const withdrawsList = async req => {
  const { id } = req.locals;
  const result = await withdrawsListService(id);
  return response(result);
};

module.exports = {
  create,
  withdrawsList,
};
