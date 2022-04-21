const forIn = require('mn-utils/forIn');
const isObject = require('mn-utils/isObject');
const extend = require('mn-utils/extend');
const merge = require('mn-utils/merge');
const map = require('mn-utils/map');
const values = require('mn-utils/values');
const reduce = require('mn-utils/reduce');
const noop = require('mn-utils/noop');
const isEmpty = require('mn-utils/isEmpty');
const writeFile = require('mn-utils/node/file/write');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');
const parseSource = require('./parseSource');
const getExclude = require('./getExclude');
const {
  getAttrs,
} = parserProvider;

const defaultSettings = exports.defaultSettings = {
  path: './',
  output: './mn.css',
  include: /^.*\.(php|html?|(js|ts)x?|vue)$/,
  exclude: /\/node_modules\/|\.tmp\./,
  watch: false,
  attrs: {
    'className': 'class',
    'class': 'class',
    'm-n': 'm-n',
    'm': 'm',
  },
  watch: false,
  metrics: false,
  presets: [
    require('../presets/prefixes'),
    require('../presets/styles'),
    require('../presets/medias'),

    // require('../presets/states'),
    require('../presets/synonyms'),

    // require('../presets/main'),
  ],
};

exports.compileSource = (__options) => {
  const settings = merge([defaultSettings, __options]);
  const {path, entry} = settings;
  isObject(entry)
    ? compileSourceBase(path, settings, entry)
    : compileSourceBase(path, settings, {
      [entry || path]: settings,
    });
};

function compileSourceBase(path, commonOptions, entries) {
  const onDone = commonOptions.onDone || noop;
  const commonPresets = commonOptions.presets || [];
  const {
    include: commonInclude,
    exclude: commonExclude,
    altColor,
  } = commonOptions;
  const commonAttrsMap = getAttrs(commonOptions.attrs || []);
  const allAttrsMap = extend({}, commonAttrsMap);
  const handlersMap = {};
  const excludesMap = {};
  forIn(entries, (entryOptions, name) => {
    const outputFileName = entryOptions.output || name;
    const options = merge([commonOptions, entryOptions]);
    options.presets = entryOptions.presets || commonPresets;
    options.altColor = entryOptions.altColor || altColor;

    const {
      metricsFiles,
      metrics,
    } = options;
    const compile = compileProvider(options);
    const isExclude = excludesMap[name] = getExclude(
        entryOptions.exclude || commonExclude,
        entryOptions.include || commonInclude,
    );
    const attrsMap = merge([commonAttrsMap, getAttrs(entryOptions.attrs)]);
    extend(allAttrsMap, attrsMap);
    handlersMap[name] = (sourcesMap) => {
      // eslint-disable-next-line
      let mergedData = {}, path, attrData, attrKey, attrName, dst, src, name, changed;
      for (path in sourcesMap) { // eslint-disable-line
        if (!isExclude(path)) {
          changed = 1;
          if (attrData = sourcesMap[path]) {
            for (attrKey in attrsMap) { // eslint-disable-line
              attrName = attrsMap[attrKey];
              dst = mergedData[attrName] || (mergedData[attrName] = {});
              src = attrData[attrName];
              for (name in src) { // eslint-disable-line
                (dst[name] || (dst[name] = {
                  name,
                  count: 0,
                })).count += src[name].count;
              }
            }
          }
        }
      }
      if (!changed) return;
      writeFile(outputFileName, compile(mergedData), __onFinally);
      metricsFiles && writeFile(metricsFiles, JSON.stringify(
          reduce(sourcesMap, (dst, attrsMap, path) => {
            isEmpty(attrsMap)
              || (dst[path] = map(attrsMap, __iterateeAttrsMap));
            return dst;
          }, {}),
          null,
          '  ',
      ), __onFinally);
      metrics && writeFile(
          metrics,
          JSON.stringify(map(mergedData, __iterateeAttrsMap), null, '  '),
          __onFinally,
      );
    };
  });

  parseSource(path, {
    watch: commonOptions.watch,
    parse: parserProvider(allAttrsMap),
    each: commonOptions.each || noop,
    exclude(path) {
      let name;
      for (name in excludesMap) {
        if (!excludesMap[name](path)) return false;
      }
      return true;
    },
    onDone(commonData, changed) {
      if (changed) {
        let k;
        for (k in handlersMap) { // eslint-disable-line
          handlersMap[k](commonData);
        }
        onDone(commonData);
      }
    },
  });
}

function __sort(a, b) {
  return b.count - a.count;
}
function __iterateeAttrsMap(essences) {
  return values(essences).sort(__sort);
}
function __onFinally(err) {
  err && console.error(err);
}
