const fs = require('fs');
const loaderUtils = require('loader-utils');
const writeFile = require('mn-utils/node/writeFile');
const eachAsync = require('mn-utils/eachAsync');
const merge = require('mn-utils/merge');
const forIn = require('mn-utils/forIn');
const forEach = require('mn-utils/forEach');
const isArray = require('mn-utils/isArray');
const isFunction = require('mn-utils/isFunction');
const values = require('mn-utils/values');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');

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
  output: './dist/app.css',
  attrs: {
    'class': 'class',
    'm-n': 'm-n',
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
__exports.defaultLoaderSettings = {
  attrs: {
    'className': 'class',
    'class': 'class',
    'm-n': 'm-n',
    'm': 'm',
  },
};

__exports.presetsReload = function(source) {
  dynamicPresetsScope[this.resourcePath] = source;
  return '';
};

__exports.MnPlugin = MnPlugin;

function normalize(v) {
  return v ? (isArray(v) ? (v.length ? v : null) : [v]) : null;
}

function MnPlugin(options) {
  const settings = merge([__exports.defaultPluginSettings, options]);
  const id = settings.id || '';
  const presets = settings.presets || [];
  const {attrs} = settings;
  const templates = normalize(settings.template);
  const outputs = normalize(settings.output);

  this.apply = (compiler) => {
    compiler.plugin('emit', (compilation, callback) => {
      const targetPresets = [...presets];

      forEach(values(dynamicPresetsScope), (source) => {
        const module = {};
        (new Function('module', source)).call(module, module);
        const {exports} = module;
        isFunction(exports) && targetPresets.push(exports);
      });

      const compile = compileProvider({
        ...settings,
        presets: targetPresets,
      });
      const parse = parserProvider(attrs);
      const sourcesMap = scope[id] || {};
      const attrsMap = {};
      forIn(sourcesMap, (source) => {
        forIn(source, (attrsMapItem, attrName) => {
          const essencesMap = attrsMap[attrName] || (attrsMap[attrName] = {});
          forIn(attrsMapItem, (value, name) => {
            (essencesMap[name] || (essencesMap[name] = {
              name,
              count: 0,
            })).count += value.count;
          });
        });
      });
      eachAsync(templates, (tpl, i, done) => {
        fs.readFile(tpl, 'utf8', (err, text) => {
          parse(attrsMap, text || '');
          done(err);
        });
      })
          .then(() => {
            const content = compile(attrsMap);
            return eachAsync(outputs, (outputFileName, i, done) => {
              writeFile(outputFileName, content, done);
            });
          })
          .then(callback);
    });
  };
};
