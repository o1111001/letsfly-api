const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, BUCKET_NAME } = require('../../../config/env');

const s3 = new AWS.S3({
  // endpoint: 's3-eu-central-1.amazonaws.com',
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'eu-central-1',
});

const getSignedUrl = key => s3.getSignedUrl('getObject', {
  Bucket: BUCKET_NAME,
  Key: key,
  Expires: 60 * 5,
});

module.exports = getSignedUrl;
