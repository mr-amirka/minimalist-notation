const fs = require('fs');
const Path = require('path');
const through = require('through2');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');
const isObject = require('mn-utils/isObject');
const isString = require('mn-utils/isString');

function gulpMN(outputFileName, options) {
  if (isObject(outputFileName)) {
    options = outputFileName;
  } else {
    options || (options = {});
    if (isString(outputFileName)) options.output = outputFileName;
  }
  const settings = {
    ...defaultSettings,
    ...options,
  };
  const parse = parserProvider(settings.attrs);
  const compile = compileProvider(settings);
  outputFileName = settings.output;

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
    const output = compile(data);
    data = {};
    fs.mkdir(Path.dirname(outputFileName), {recursive: true}, (err) => {
      if (err) {
        console.error(err);
        return cb();
      }
      fs.writeFile(outputFileName, output, 'utf8', (err) => {
        err && console.error(err);
        cb();
      });
    });

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
    require('mn-presets/medias'),
  	require('mn-presets/prefixes'),
  	require('mn-presets/styles'),
  	require('mn-presets/states'),
  	require('mn-presets/theme'),
  ],
};

module.exports = gulpMN;
