const fs = require('fs');
const Path = require('path');

function checkDir(outputFileName, callback) {
  const dirname = Path.dirname(outputFileName);
  dirname ? fs.mkdir(dirname, {recursive: true}, callback) : callback();
}

module.exports = checkDir;
