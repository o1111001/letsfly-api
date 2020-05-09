const fs = require('fs');
const { join, resolve } = require('path');

const { sendError } = require('../../helpers/responses');

const download = (res, folder, filename) => {
  try {
    const path = join(resolve(global.basedir, 'storage', folder, filename));
    const isFile = fs.lstatSync(path).isFile();
    if (!isFile) return sendError(res, 'Wrong path');
    fs.access(path, fs.constants.F_OK | fs.constants.R_OK, err => {
      if (err) {
        console.error(err);
        return sendError(res, 'Wrong path');
      }

      const readStream = fs.createReadStream(path);
      readStream.pipe(res);
    });
  } catch (error) {
    return sendError(res, 'Wrong path');
  }
};

module.exports = download;
