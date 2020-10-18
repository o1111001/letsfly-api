const { CustomError } = require('../../helpers/errors');

const {
  S3_BUCKET_DOMAIN,
} = require('../../config/env');

const {
  checkAccess: checkAccessDB,
} = require('../../repositories/files');
const { getPreSignedUrl } = require('../aws_s3');
// const public = ['avatars', 'chats_avatars', 'memberships_avatars'];

const getUrl = async (userId, key) => {
  const isHasAccess = await checkAccessDB(userId, key);
  if (isHasAccess) {
    return getPreSignedUrl(key);
  }
  throw new CustomError('Check access error', 422);
};

module.exports = getUrl;
