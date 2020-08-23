const {
  download: getFileService,
} = require('../../services/files');

const getFile = async req => {
  const { folder, filename } = req.params;
  return getFileService(folder, filename);
};


module.exports = {
  getFile,
};

