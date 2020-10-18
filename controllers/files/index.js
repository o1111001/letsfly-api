const {
  getUrl: getUrlService,
} = require('../../services/files');

const { responseCreator } = require('../../helpers/responses');

const getPreSignedUrl = async req => {
  const { key } = req.query;
  const { id: userId } = req.locals;
  const url = await getUrlService(userId, key);
  return responseCreator({ url });
};

module.exports = {
  getPreSignedUrl,
};

