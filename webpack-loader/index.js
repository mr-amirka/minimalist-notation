const fs = require("fs");
const Path = require("path");
const loaderUtils = require("loader-utils");
const merge = require('mn-utils/merge');
const forIn = require('mn-utils/forIn');
const forEach = require('mn-utils/forEach');
const isArray = require('mn-utils/isArray');
const isFunction = require('mn-utils/isFunction');
const values = require('mn-utils/values');
const parserProvider = require("../mnParserProvider");
const compileProvider = require("../mnCompileProvider");
const scope = {};
const dynamic_presets_scope = {};

const __exports = module.exports = function(source) {
  const settings = merge([ __exports.defaultLoaderSettings, loaderUtils.getOptions(this) ]);
  const id = settings.id || '';
  parserProvider(settings.attrs)((scope[id] || (scope[id] = {}))[this.resourcePath] = {}, source || '');
  return source;
};

__exports.defaultPluginSettings = {
  output: './dist/app.css',
  attrs: [ 'm' ],
  presets: [
    require('mn-presets/medias'),
  	require('mn-presets/prefixes'),
  	require('mn-presets/styles'),
  	require('mn-presets/states'),
  	require('mn-presets/theme')
  ]
};
__exports.defaultLoaderSettings = {
  attrs: [ 'm' ]
};

__exports.presetsReload = function (source) {
  dynamic_presets_scope[this.resourcePath] = source;
  return '';
};

__exports.MnPlugin = MnPlugin;

const normalize = v => v ? (isArray(v) ? (v.length ? v : null) : [ v ]) : null;

function MnPlugin(options) {
  const settings = merge([ __exports.defaultPluginSettings, options ]);
  const id = settings.id || '';
  const presets = settings.presets || [];
  const { attrs } = settings;
  const templates = normalize(settings.template);
  const outputs = normalize(settings.output);

  this.apply = (compiler) => {
    compiler.plugin('emit', (compilation, callback) => {

      const target_presets = [ ...presets ];
      forEach(values(dynamic_presets_scope), (source) => {
        const module = {};
        (new Function('module', source)).call(module, module);
        const { exports } = module;
        isFunction(exports) && target_presets.push(exports);
      });

      const compile = compileProvider({
        ...settings,
        presets: target_presets
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
              count: 0
            })).count += value.count;
          });
        });
      });
      const done = () => {
        if (!outputs) return callback();
        let i = 0;
        const content = compile(attrsMap), length = outputs.length, onWrite = (err, text) => {
          err && console.error(err);
          ++i < length || callback();
        };
        forEach(outputs, (outputFileName) => {
          const dirname = Path.dirname(outputFileName);
          dirname && fs.mkdirSync(dirname, { recursive: true });
          fs.writeFile(outputFileName, content, onWrite);
        });
      };
      if (!templates) return done();
      let i = 0;
      const length = templates.length, onRead = (err, text) => {
        err && console.error(err);
        parse(attrsMap, text || '');
        ++i < length || done();
      };
      forEach(templates, (tpl) => {
        fs.readFile(tpl, 'utf8', onRead);
      });
    });
  };
};
