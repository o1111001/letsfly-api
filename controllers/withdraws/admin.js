
const {
  changeStatus: changeStatusService,
  withdrawsFullList: withdrawsFullListService,
} = require('../../services/withdraws/admin');
const { sendError } = require('../../helpers/responses');

const response = data => ({
  message: `Success`,
  data,
});


const changeWithdrawStatus = async (req, res) => {
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

const withdrawsFullList = async (req, res) => {
  try {
    const result = await withdrawsFullListService();
    return res.send(response(result));
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  changeWithdrawStatus,
  withdrawsFullList,
};
