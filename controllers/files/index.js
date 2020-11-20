const {
  getUrl: getUrlService,
} = require('../../services/files');

const { responseCreator } = require('../../helpers/responses');
const fs = require('fs');


const getPreSignedUrl = async req => {
  const { key } = req.query;
  const { id: userId } = req.locals;
  fs.appendFile('log.txt', 's3\n', () => {});
  const url = await getUrlService(userId, key);
  return responseCreator({ url });
};

module.exports = {
  getPreSignedUrl,
};

