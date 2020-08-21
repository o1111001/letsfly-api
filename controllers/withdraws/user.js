
const {
  create: createWithdrawService,
  withdrawsList: withdrawsListService,
} = require('../../services/withdraws/user');

const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const create = async (req, res) => {
  try {
    const { id } = req.locals;
    const { amount, cardNumber, comment } = req.body;
    const result = await createWithdrawService(id, amount, cardNumber, comment);
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};

const withdrawsList = async (req, res) => {
  try {
    const { id } = req.locals;
    const result = await withdrawsListService(id);
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};


module.exports = {
  create,
  withdrawsList,
};
