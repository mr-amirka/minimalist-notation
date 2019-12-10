const fs = require('fs');
const loaderUtils = require('loader-utils');
const merge = require('mn-utils/merge');
const forIn = require('mn-utils/forIn');
const forEach = require('mn-utils/forEach');
const isArray = require('mn-utils/isArray');
const isFunction = require('mn-utils/isFunction');
const values = require('mn-utils/values');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');
const eachAsync = require('../build-utils/eachAsync');
const checkDir = require('../build-utils/checkDir');

const scope = {};
const dynamicPresetsScope = {};

const __exports = module.exports = function(source) {
  const settings = merge([
    __exports.defaultLoaderSettings,
    loaderUtils.getOptions(this),
  ]);
  const id = settings.id || '';
  parserProvider(settings.attrs)(
      (scope[id] || (scope[id] = {}))[this.resourcePath] = {},
      source || '',
  );
  return source;
};

__exports.defaultPluginSettings = {
  output: './dist/app.css',
  attrs: {
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
__exports.defaultLoaderSettings = {
  attrs: {
    'className': 'class',
    'class': 'class',
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
          err && console.error(err);
          parse(attrsMap, text || '');
          done();
        });
      })
          .then(() => {
            const content = compile(attrsMap);
            return eachAsync(outputs, (outputFileName, i, done) => {
              checkDir(outputFileName, (err) => {
                err
                  ? done(err)
                  : fs.writeFile(outputFileName, content, 'utf8', done);
              });
            });
          })
          .then(callback);
    });
  };
};
