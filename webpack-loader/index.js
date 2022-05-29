const loaderUtils = require('loader-utils');
const eachAsync = require('mn-utils/eachAsync');
const noop = require('mn-utils/noop');
const extend = require('mn-utils/extend');
const merge = require('mn-utils/merge');
const forEach = require('mn-utils/forEach');
const isString = require('mn-utils/isString');
const isArray = require('mn-utils/isArray');
const isFunction = require('mn-utils/isFunction');
const values = require('mn-utils/values');
const writeFile = require('mn-utils/node/file/write');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');
const parseSource = require('../node/parseSource');
const getExclude = require('../node/getExclude');

const scope = {};
const dynamicPresetsScope = {};

const __exports = module.exports = function(source) {
  const self = this;
  const settings = merge([
    __exports.defaultLoaderSettings,
    loaderUtils.getOptions(self),
  ]);
  const id = settings.id || '';
  parserProvider(settings.attrs)(
      (scope[id] || (scope[id] = {}))[self.resourcePath] = {},
      source || '',
  );
  return source;
};

__exports.defaultPluginSettings = {
  path: './',
  include: [
    /^.*\.(php|html?)$/,
  ],
  exclude: [
    /\/node_modules\/|(.*\.tmp)/,
  ],
  output: './dist/app.css',
  attrs: {
    'className': 'class',
    'class': 'class',
    'm-n': 'm-n',
    'm': 'm',
  },
  presets: [
    require('../presets/prefixes'),
    require('../presets/styles'),
    require('../presets/medias'),
    require('../presets/synonyms'),
  ],
  onError(e) {
    console.error(e);
  },
};
__exports.defaultLoaderSettings = {
  attrs: {
    'className': 'class',
    'class': 'class',
    'm-n': 'm-n',
    'm': 'm',
  },
};

__exports.presetsReload = function(source) {
  const module = {};
  try {
    (new Function('module', source)).call(module, module);
  } catch (e) {
    console.error(e);
  }
  dynamicPresetsScope[this.resourcePath] = module.exports;
  return '';
};

__exports.MnPlugin = MnPlugin;

function normalize(v, output) {
  if (v) {
    if (isString(v)) {
      output.push(v);
    } else if (isArray(v)) {
      let i = 0, l = v.length; // eslint-disable-line
      for (; i < l; i++) normalize(v[i], output);
    }
  }
  return output;
}

function MnPlugin(options) {
  const settings = merge([__exports.defaultPluginSettings, options]);
  const parse = parserProvider(settings.attrs);
  const id = settings.id || '';
  const path = settings.path;
  const presets = settings.presets || [];
  const onDone = settings.onDone || noop;
  const commonEach = settings.each || noop;
  const outputs = normalize(settings.output, []);
  const sourcesMap = scope[id] || (scope[id] = {});

  if (!(path && isString(path))) {
    throw new Error('Path is invalid');
  }
  if (!parse) {
    throw new Error('Attrs is invalid');
  }

  let compile = compileProvider({
    ...settings,
    presets,
  });

  function base() {
    const attrsMap = {};
    let source, path, essencesMap, attrsMapItem, name; // eslint-disable-line
    for (path in sourcesMap) { // eslint-disable-line
      source = sourcesMap[path];
      for (attrName in source) { // eslint-disable-line
        attrsMapItem = source[attrName];
        essencesMap = attrsMap[attrName] || (attrsMap[attrName] = {});
        for (name in attrsMapItem) { // eslint-disable-line
          (essencesMap[name] || (essencesMap[name] = {
            name,
            count: 0,
          })).count += attrsMapItem[name].count;
        }
      }
    }
    const content = compile(attrsMap);
    onDone(content, sourcesMap);
    return eachAsync(outputs, (outputFileName, i, done) => {
      writeFile(outputFileName, content, done);
    });
  }

  this.apply = (compiler) => {
    const options = compiler.options || {};
    parseSource(path, {
      watch: options.watch,
      parse,
      each: commonEach,
      exclude: getExclude(
          settings.exclude,
          [settings.include, settings.template],
      ),
      onDone(commonData, changed) {
        changed && (
          extend(sourcesMap, commonData),
          base()
        );
      },
    });

    compiler.plugin('emit', (compilation, callback) => {
      const targetPresets = [...presets];

      forEach(values(dynamicPresetsScope), (preset) => {
        isFunction(preset) && targetPresets.push(preset);
      });

      compile = compileProvider({
        ...settings,
        presets: targetPresets,
      });

      base().then(callback);
    });
  };
};
