'use strict';

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const ext = path.extname(file.originalname);
    if (['.png', '.jpg', '.jpeg'].includes(ext)) return cb(null, `storage/chats_avatars/`);
  },
});

const limits = {
  fileSize: 25 * 1024 * 1024,
};

const upload = multer({ storage, limits });

module.exports = upload;
