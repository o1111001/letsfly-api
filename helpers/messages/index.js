const path = require('path');

const exts = {
  '.mp4': 'video',
  '.mp3': 'audio',
  '.png': 'photo',
  '.jpg': 'photo',
  '.jpeg': 'photo',
};

module.exports.checkAttachmentFileType = (msgType, attachment) => {
  const ext = path.extname(attachment);
  if (msgType === 'audio') return 'audio_message';
  return exts[ext] || 'another';
};
