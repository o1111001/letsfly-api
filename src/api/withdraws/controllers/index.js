
const {
  withdraw: withdrawService,
  changeStatus: changeStatusService,
  withdrawsList: withdrawsListService,
  withdrawsFullList: withdrawsFullListService,
} = require('../services');
const { sendError } = require('../../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});

const withdraw = async (req, res) => {
  try {
    const { id } = req.locals;
    const { amount, cardNumber, comment } = req.body;
    const result = await withdrawService(id, amount, cardNumber, comment);
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};

const withdrawStatus = async (req, res) => {
  try {
    const {
      id,
      status,
    } = req.body;
    const result = await changeStatusService(id, status);
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

const withdrawsFullList = async (req, res) => {
  try {
    const result = await withdrawsFullListService();
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  withdraw,
  withdrawStatus,
  withdrawsList,
  withdrawsFullList,
};
