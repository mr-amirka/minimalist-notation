const forEachAsync = require('mn-utils/async/forEach');
const noop = require('mn-utils/noop');
const extend = require('mn-utils/extend');
const merge = require('mn-utils/merge');
const forIn = require('mn-utils/forIn');
const isString = require('mn-utils/isString');
const isArray = require('mn-utils/isArray');
const isFunction = require('mn-utils/isFunction');
const writeFile = require('mn-utils/node/file/promisify/write');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');
const parseSource = require('../node/parseSource');
const getExclude = require('../node/getExclude');

const defaultPluginSettingsModule = require('./defaultPluginSettings');


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

module.exports = (settings) => {
  settings = settings || {};

  const defaultLoaderSettings = merge([
    defaultPluginSettingsModule.defaultLoaderSettings,
    settings.defaultLoaderSettings || {},
  ]);
  const defaultPluginSettings = merge([
    defaultPluginSettingsModule.defaultPluginSettings,
    settings.defaultPluginSettings || {},
  ]);

  const scope = settings.scope || {};
  const dynamicPresetsScope = settings.dynamicPresetsScope || {};

  return {
    sourceHandle(params) {
      const {
        source,
      } = params;

      const key = params.key || '';
      const settings = merge([
        defaultLoaderSettings,
        params.settings || {},
      ]);
      const id = settings.id || '';
      parserProvider(settings.attrs)(
        (scope[id] || (scope[id] = {}))[key] = {},
        params.source || '',
      );
      return {
        source,
      };
    },

    sourceHandleOfPresetsReload(params) {
      const {
        source,
      } = params;

      const key = params.key || '';
      const settings = params.settings || {};
      const id = settings.id || '';
    
      const module = {};
      try {
        (new Function('module', source)).call(module, module);
      } catch (e) {
        console.error(e);
      }
      (dynamicPresetsScope[id]
          || (dynamicPresetsScope[id] = {}))[key] = module.exports;

      return {
        source: '',
      };
    },

    plugin(options) {
      const settings = merge([defaultPluginSettings, options]);
      const parse = parserProvider(settings.attrs);
      const id = settings.id || '';
      const path = settings.path;
      const presets = settings.presets || [];
      const onDone = settings.onDone || noop;
      const commonEach = settings.each || noop;
      const outputs = normalize(settings.output, []);
      const sourcesMap = scope[id] || (scope[id] = {});
      const dynamicPresetsMap = dynamicPresetsScope[id]
        || (dynamicPresetsScope[id] = {});

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
        return forEachAsync(outputs, (outputFileName) => {
          return writeFile(outputFileName, content);
        });
      }

      return {
        startTemplateParse(options) {
          options = options || {};

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
        },

        async startCompile(options) {
          const targetPresets = presets.slice();

          forIn(dynamicPresetsMap, (preset) => {
            isFunction(preset) && targetPresets.push(preset);
          });

          compile = compileProvider({
            ...settings,
            presets: targetPresets,
          });

          return base();
        },
      };

    },

  };
};

