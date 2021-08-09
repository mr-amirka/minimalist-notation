const fs = require('fs');
const fsWatch = require('node-watch');
const scanPath = require('mn-utils/node/scanPath');
const finallyAll = require('mn-utils/finallyAll');
const noop = require('mn-utils/noop');

const regexpNormalize = /\\/gim;

function scanPathWatch({path, each, callback, exclude}) {
  scanPath({
    path,
    each,
    exclude,
    callback: () => {
      fsWatch(path, {recursive: true}, (e, p) => {
        p = p.replace(regexpNormalize, '/');
        exclude(p) || each(e, p);
      });
      callback && callback();
    },
  });
}

module.exports = (path, options) => {
  const onDone = options.onDone || noop;
  const data = {};

  let changed;
  finallyAll((inc, dec) => {
    inc();
    const commonEach = options.each || noop;
    const {
      parse,
    } = options;
    (options.watch ? scanPathWatch : scanPath)({
      path,
      exclude: options.exclude,
      callback: dec,
      each: (eventType, path) => {
        changed = 1;
        if (eventType === 'remove') {
          data[path] = null;
          return;
        }
        inc();
        fs.readFile(path, 'utf8', (err, text) => {
          const output = data[path] = {};
          const count = parse(output, text || '');
          commonEach(path, count, output);
          dec();
        });
      },
    });
  }, () => {
    onDone(data, changed);
    changed = 0;
  });
};
