const {
  changeStatus: changeStatusService,
  withdrawsFullList: withdrawsFullListService,
} = require('../services/admin');

const response = data => ({
  message: `Success`,
  data,
});


const changeWithdrawStatus = async req => {
  const {
    id,
    status,
  } = req.body;
  const result = await changeStatusService(id, status);
  return response(result);
};

const withdrawsFullList = async () => {
  const result = await withdrawsFullListService();
  return response(result);
};

module.exports = {
  changeWithdrawStatus,
  withdrawsFullList,
};
