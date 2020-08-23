const fs = require('fs');
const { join, resolve } = require('path');

const { CustomError } = require('../../helpers/errors');

const download = (folder, filename) => new Promise(resolvePromise => {
  const path = join(resolve(global.basedir, 'storage', folder, filename));
  const { size } = fs.lstatSync(path);
  fs.access(path, fs.constants.F_OK | fs.constants.R_OK, err => {
    if (err) {
      throw new CustomError('Wrong path', 404);
    }
    const readStream = fs.createReadStream(path);
    return resolvePromise({ readStream, size });
  });
});

module.exports = download;
