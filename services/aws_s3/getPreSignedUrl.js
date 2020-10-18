const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  // endpoint: 's3-eu-central-1.amazonaws.com',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'eu-central-1',
});
// const s3 = new AWS.S3();

const { BUCKET_NAME } = require('../../config/env');

const getSignedUrl = key => s3.getSignedUrl('getObject', {
  Bucket: BUCKET_NAME,
  Key: key,
  Expires: 60 * 5,
});

module.exports = getSignedUrl;
