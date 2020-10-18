'use strict';

const multer = require('multer');
const path = require('path');

const storage = dir => multer.diskStorage({
  destination(req, file, cb) {
    return cb(null, `storage/${dir}`);
  },
  filename(req, file, cb) {
    const fileName = Math.random() + Date.now() + path.extname(file.originalname);
    return cb(null, fileName);
  },
});

const upload = dir => multer({ storage: storage(dir) });

module.exports = upload;
