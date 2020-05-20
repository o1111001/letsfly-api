const {
  download: getFileService,
} = require('../../services/files');

const { sendError } = require('../../helpers/responses');

const getFile = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    getFileService(res, folder, filename);
  } catch (error) {
    return sendError(res, error);
  }
};


module.exports = {
  getFile,
};

