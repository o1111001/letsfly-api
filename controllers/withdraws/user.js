
const {
  create: createWithdrawService,
  withdrawsList: withdrawsListService,
  historyList: historyListService,
} = require('../../services/withdraws/user');

const { responseCreator } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const create = async req => {
  const { id } = req.locals;
  const { amount, cardNumber, comment } = req.body;
  const result = await createWithdrawService(id, amount, cardNumber, comment);
  console.log(result);
  return response(result);
};

const withdrawsList = async req => {
  const { id } = req.locals;
  const result = await withdrawsListService(id);
  return response(result);
};

const historyList = async req => {
  const { id } = req.locals;
  const list = await historyListService(id);
  return responseCreator({ list });
};

module.exports = {
  create,
  withdrawsList,
  historyList,
};
