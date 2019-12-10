const fs = require('fs');
const Path = require('path');
const {scanPath, scanPathWatch} = require('mn-back-utils/scanPath');
const finallyAll = require('mn-utils/finallyAll');
const forIn = require('mn-utils/forIn');
const map = require('mn-utils/map');
const values = require('mn-utils/values');
const reduce = require('mn-utils/reduce');
const isArray = require('mn-utils/isArray');
const isObject = require('mn-utils/isObject');
const eachApply = require('mn-utils/eachApply');
const extend = require('mn-utils/extend');
const merge = require('mn-utils/merge');
const noop = require('mn-utils/noop');
const isEmpty = require('mn-utils/isEmpty');
const parserProvider = require('../mnParserProvider');
const compileProvider = require('../mnCompileProvider');

const getAttrs = parserProvider.getAttrs;

const defaultSettings = exports.defaultSettings = {
  path: './',
  output: './mn.styles.css',
  include: /^.*\.(html?|(js|ts)x?|vue)$/,
  exclude: /\/node_modules\/|\.tmp\./,
  attrs: {
    'className': 'class',
    'class': 'class',
    'm': 'm',
  },
  watch: false,
  metrics: false,
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/prefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    require('mn-presets/theme'),
  ],
};

exports.compileSource = (__options) => {
  const settings = merge([defaultSettings, __options]);
  const {path, entry} = settings;
  isObject(entry)
    ? parseSource(path, settings, entry)
    : parseSource(path, settings, {
      [settings.entry || settings.path]: settings,
    });
};

function __sort(a, b) {
  return b.count - a.count;
}
function __onError(err) {
  err && console.error(err);
}
function __parseSource({path, attrs, each, callback, watch, exclude}) {
  finallyAll((inc, dec) => {
    inc();
    const __parse = parserProvider(attrs);
    (watch ? scanPathWatch : scanPath)({
      path,
      exclude,
      callback: dec,
      each: (eventType, path) => {
        each(path, (setter) => {
          if (eventType === 'remove') return setter(null, 0);
          inc();
          fs.readFile(path, 'utf8', (err, text) => {
            const dst = {};
            setter(dst, __parse(dst, text || ''));
            dec();
          });
        });
      },
    });
  }, callback);
}

function parseSource(path, commonOptions, entries) {
  const finish = commonOptions.finish || noop;
  const __each = commonOptions.each || noop;
  const attrs = commonOptions.attrs || [];
  const presets = commonOptions.presets || [];
  const selectorPrefix = commonOptions.selectorPrefix || '';
  const commonMetrics = commonOptions.metrics || false;
  const {include, exclude, watch} = commonOptions;
  const allAttrsMap = getAttrs(attrs);
  const handlersMap = {};
  const excludesMap = {};
  forIn(entries, (entryOptions, name) => {
    let attrsMap = getAttrs(entryOptions.attrs);
    if (isEmpty(attrsMap)) {
      attrsMap = allAttrsMap;
    } else {
      attrsMap = extend(extend({}, allAttrsMap), attrsMap);
    }
    let hasMetrics = entryOptions.metrics;
    hasMetrics === false || hasMetrics === true || (hasMetrics = commonMetrics);
    const data = {};
    const _include = getInclude(entryOptions.include || include);
    const _exclude = excludesMap[name]
    = getInclude(entryOptions.exclude || exclude);
    handlersMap[name] = {
      isExclude: wrapExclude(_exclude, _include),
      set: setDataProvider(data, attrsMap),
      build: buildProvider(data, entryOptions.output || name, compileProvider({
        presets: entryOptions.presets || presets,
        selectorPrefix: entryOptions.selectorPrefix || selectorPrefix,
      }), hasMetrics),
    };
  });

  let hasFinished;
  __parseSource({
    watch,
    path: path,
    attrs: Object.keys(allAttrsMap),
    exclude: (path) => {
      let name;
      for (name in excludesMap) {
        if (!excludesMap[name](path)) return false;
      }
      return true;
    },
    each: (path, parse) => {
      let cache, started, finished, watchers = []; // eslint-disable-line
      forIn(handlersMap, ({isExclude, set, build}, name) => {
        if (isExclude(path)) return;
        function __build() {
          set(path, cache);
          hasFinished && build();
        }
        if (finished) return __build();
        if (started) {
          watchers.push(__build);
        } else {
          started = true;
          parse((output, count) => {
            __each(path, count);
            cache = output;
            finished = true;
            eachApply(watchers);
            __build();
          });
        }
      });
    },
    callback: () => {
      hasFinished = true;
      forIn(handlersMap, ({build}) => {
        build();
      });
      finish();
    },
  });
}

function wrapExclude(exclude, include) {
  return (path) => {
    if (exclude(path)) return true;
    if (include(path)) return false;
    return true;
  };
}
function getInclude(include) {
  return include ? (isArray(include) ? (path) => {
    for (i = include.length; i--;) {
      if ((v = include[i]) && v.test(path)) return true;
    }
  } : (path) => include.test(path)) : noop;
}
function __iterateeAttrsMap(essences) {
  return values(essences).sort(__sort);
}
function buildProvider(data, name, compile, hasMetrics) {
  regexpCSS.test(name) || (name += '.css');

  const dirname = Path.dirname(name);
  dirname && fs.mkdirSync(dirname, {recursive: true});

  const metricsFilesPath = name + '.mn-metrics-files.json';
  const metricsPath = name + '.mn-metrics.json';
  function onFinally(err) {
    err && console.error(err);
  }
  return () => {
    const mergedData = {};
    function attrsIteratee(essencesNames, attrName) {
      const values = mergedData[attrName] || (mergedData[attrName] = {});
      forIn(essencesNames, (item, name) => {
        (values[name] || (values[name] = {
          name, count: 0
        })).count += item.count;
      });
    }
    forIn(data, (srcAttrsMap) => {
      forIn(srcAttrsMap, attrsIteratee);
    });

    fs.writeFile(name, compile(mergedData), onFinally);

    if (hasMetrics) {
      fs.writeFile(metricsFilesPath, JSON.stringify(
          reduce(data, (dst, attrsMap, path) => {
            isEmpty(attrsMap)
              || (dst[path] = map(attrsMap, __iterateeAttrsMap));
            return dst;
          }, {}),
          null,
          '  ',
      ), __onError);
      fs.writeFile(
          metricsPath,
          JSON.stringify(map(mergedData, __iterateeAttrsMap), null, '  '),
          __onError,
      );
    }
  };
}
function setDataProvider(data, attrsMap) {
  return (path, src) => {
    if (src) {
      const dst = data[path] = {};
      let v, k, n; //eslint-disable-line
      for (k in attrsMap) (v = src[n = attrsMap[k]]) === undefined || (dst[n] = v); //eslint-disable-line
    } else {
      delete data[path];
    }
  };
}
const regexpCSS = /.*\.css$/;
