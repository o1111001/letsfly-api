const {
  changePublicity: changePublicityService,
} = require('../services');

const { responseCreator } = require('../../../helpers/responses');

const changePublicity = async req => {
  const { id, isPublic } = req.body;
  const { id: userId } = req.locals;

  await changePublicityService(userId, { id, isPublic });
  return responseCreator({ id, isPublic });
};

module.exports = changePublicity;
