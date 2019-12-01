const fs = require('fs');
const Path = require('path');
const loaderUtils = require('loader-utils');
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
  const settings = merge([
    __exports.defaultLoaderSettings,
    loaderUtils.getOptions(this)],
  );
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
    className: 'class',
    m: 'm',
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
    className: 'class',
    m: 'm',
  },
};

__exports.presetsReload = function(source) {
  dynamicPresetsScope[this.resourcePath] = source;
  return '';
};

__exports.MnPlugin = MnPlugin;

const normalize = (v) => v ? (isArray(v) ? (v.length ? v : null) : [v]) : null;

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
            eachAsync(outputs, (outputFileName, i, done) => {
              mkdir(outputFileName, () => {
                fs.writeFile(outputFileName, content, done);
              });
            }).then(callback);
          });
    });
  };
};
function eachAsync(items, iteratee) {
  return new Promise((resolve) => {
    const length = items && items.length || 0;
    let i = 0;
    length < 1 ? resolve() : forEach(items, (item, index) => {
      let called;
      iteratee(item, index, (err) => {
        err && console.error(err);
        if (called) return;
        called = true;
        ++i < length || resolve();
      });
    });
  });
}
function mkdir(outputFileName, callback) {
  const dirname = Path.dirname(outputFileName);
  dirname ? fs.mkdir(dirname, {recursive: true}, callback) : callback();
}
