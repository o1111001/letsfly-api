const { CustomError } = require('../../helpers/errors');

const {
  checkAccess: checkAccessDB,
} = require('../../repositories/files');
const { getPreSignedUrl } = require('../aws_s3');
const getUrl = async (userId, key) => {
  const checkedKey = key
    .replace('_thumbs', '')
    .replace('_blured', '')
    .replace('_resized', '')
    .split('.')[0];
  const isHasAccess = await checkAccessDB(userId, checkedKey);
  if (isHasAccess) {
    return getPreSignedUrl(key);
  }
  throw new CustomError('Check access error', 422);
};

module.exports = getUrl;
