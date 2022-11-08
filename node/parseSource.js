const fs = require('fs');
const fsWatch = require('node-watch');
const scanPath = require('mn-utils/node/scanPath');
const finallyAll = require('mn-utils/finallyAll');
const noop = require('mn-utils/noop');


function scanPathWatch(options) {
  return scanPath(options).then(() => {
    const _each = options.each || noop;
    const _exclude = options.exclude || noop;
    fsWatch(options.path, {
      recursive: true,
    }, (e, p) => {
      _exclude(p) || _each(e, p);
    });
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
    }).then(dec);
  }, () => {
    onDone(data, changed);
    changed = 0;
  });
};
