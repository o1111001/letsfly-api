'use strict';

const multer = require('multer');
const path = require('path');
const randomstring = require('randomstring');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext === '.mp4') return cb(null, `storage/video/`);
    if (ext === '.mp3') return cb(null, `storage/audio/`);
    if (['.png', '.jpg', '.jpeg'].includes(ext)) return cb(null, `storage/photo/`);
    if (req.body.type === 'audio') return cb(null, `storage/audio_messages/`);
    return cb(null, `storage/another/`);
  },
  filename(req, file, cb) {
    if (req.body.type === 'audio') return cb(null, randomstring.generate(30) + '.mp3');
    return cb(null, randomstring.generate(30) + path.extname(file.originalname));
  },
});

const limits = {
  fileSize: 25 * 1024 * 1024,
};

const upload = multer({ storage, limits });

module.exports = upload;
