const Path = require('path');
const through = require('through2');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');
const isObject = require('mn-utils/isObject');
const isString = require('mn-utils/isString');
const isArray = require('mn-utils/isArray');
const eachAsync = require('mn-utils/eachAsync');
const writeFile = require('mn-utils/node/writeFile');

function normalize(v) {
  return v ? (isArray(v) ? (v.length ? v : null) : [v]) : null;
}

function gulpMN(outputs, options) {
  if (isString(outputs) || isArray(outputs)) {
    options || (options = {});
    options.output = outputs;
  } else {
    if (!options && isObject(outputs)) options = outputs;
  }
  const settings = {
    ...defaultSettings,
    ...options,
  };
  const parse = parserProvider(settings.attrs);
  const compile = compileProvider(settings);
  outputs = normalize(settings.output);

  let data = {};
  return through.obj(function(file, enc, cb) {
    const {path} = file;
    if (
      file.isNull()
        || file.isStream()
        || Path.basename(path).indexOf('_') === 0
    ) {
      return cb(null, file);
    }
    parse(data, file.contents.toString());
    cb(null, file);
  }, function(cb) {
    const content = compile(data);
    data = {};
    eachAsync(outputs, (outputFileName, i, done) => {
      writeFile(outputFileName, content, done);
    }).then(cb);
  });
}
const defaultSettings = gulpMN.defaultSettings = {
  output: './mn.styles.css',
  selectorPrefix: '',
  attrs: {
    'className': 'class',
    'class': 'class',
    'm': 'm',
  },
  presets: [
    require('../presets/medias'),
    require('../presets/prefixes'),
    require('../presets/styles'),
    require('../presets/states'),
    // require('../presets/main'),
  ],
};

module.exports = gulpMN;
