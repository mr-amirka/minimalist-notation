const selectorsCompileProvider = require('./selectorsCompileProvider');
const Emitter = require('mn-utils/Emitter');
const extend = require('mn-utils/extend');
const isPlainObject = require('mn-utils/isPlainObject');
const isObject = require('mn-utils/isObject');
const isArray = require('mn-utils/isArray');
const isNumber = require('mn-utils/isNumber');
const set = require('mn-utils/set');
const get = require('mn-utils/get');
const aggregate = require('mn-utils/aggregate');
const eachApply = require('mn-utils/eachApply');
const eachTry = require('mn-utils/eachTry');
const mergeDepth = require('mn-utils/mergeDepth');
const flags = require('mn-utils/flags');
const joinMaps = require('mn-utils/joinMaps');
const routeParseProvider = require('mn-utils/routeParseProvider');
const forIn = require('mn-utils/forIn');
const forEach = require('mn-utils/forEach');
const reduce = require('mn-utils/reduce');
const cssPropertiesStringifyProvider
  = require('mn-utils/cssPropertiesStringifyProvider');
const cssPropertiesParse = require('mn-utils/cssPropertiesParse');
const push = require('mn-utils/push');
const pushArray = require('mn-utils/pushArray');
const splitProvider = require('mn-utils/splitProvider');
const joinProvider = require('mn-utils/joinProvider');
const withDefer = require('mn-utils/withDefer');
const withResult = require('mn-utils/withResult');
const map = require('mn-utils/map');
const __values = require('mn-utils/values');
const merge = require('mn-utils/merge');
const isString = require('mn-utils/isString');
const noop = require('mn-utils/noop');
const variants = require('mn-utils/variants');
const keys = require('mn-utils/keys');
const {
  SC_ESSENCES,
  SC_SELECTORS,
  SC_MEDIA_NAME,
} = require('./constants');

const utils = merge([
  {
    Emitter: Emitter,
    color: require('mn-utils/color'),
    colorGetBackground: require('mn-utils/colorGetBackground'),
    trimProvider: require('mn-utils/trimProvider'),
    half: require('mn-utils/half'),
    unslash: require('mn-utils/unslash'),
    noop,
    support: require('mn-utils/support'),
    size: require('mn-utils/size'),
    extend,
    merge,
    isPlainObject,
    isObject,
    isArray,
    isNumber,
    isString,
    isNumber: require('mn-utils/isNumber'),
    isObjectLike: require('mn-utils/isObjectLike'),
    isPromise: require('mn-utils/isPromise'),
    isIndex: require('mn-utils/isIndex'),
    isLength: require('mn-utils/isLength'),
    isEmpty: require('mn-utils/isEmpty'),
    once: require('mn-utils/once'),
    delay: require('mn-utils/delay'),
    removeOf: require('mn-utils/removeOf'),
    addOf: require('mn-utils/addOf'),
    set,
    get,
    aggregate,
    eachApply,
    eachTry,
    extendDepth: require('mn-utils/extendDepth'),
    mergeDepth,
    flags,
    flagsSet: require('mn-utils/flagsSet'),
    joinMaps,
    joinArrays: require('mn-utils/joinArrays'),
    routeParseProvider,
    forIn,
    forEach,
    reduce,
    filter: require('mn-utils/filter'),
    cssPropertiesStringifyProvider,
    cssPropertiesParse,
    push,
    pushArray,
    splitProvider,
    joinProvider,
    withDefer,
    withResult,
    map,
    values: __values,
    keys,
    escapedSplitProvider: require('mn-utils/escapedSplitProvider'),
    mapperProvider: require('mn-utils/mapperProvider'),
    regexpMapperProvider: require('mn-utils/regexpMapperProvider'),
    variants,
    escapeQuote: require('mn-utils/escapeQuote'),
    escapeRegExp: require('mn-utils/escapeRegExp'),
    escapeCss: require('mn-utils/escapeCss'),
    escapedHalfProvider: require('mn-utils/escapedHalfProvider'),
    upperFirst: require('mn-utils/upperFirst'),
    lowerFirst: require('mn-utils/lowerFirst'),
    camelToKebabCase: require('mn-utils/camelToKebabCase'),
    kebabToCamelCase: require('mn-utils/kebabToCamelCase'),
    defer: require('mn-utils/defer'),
  },
  require('mn-utils/anyval'),
]);

const // eslint-disable-line
  OBJECT = 'object',
  FUNCTION = 'function',
  STRING = 'string',
  baseSet = set.base,
  baseGet = get.base;
const MN_MERGE_DEPTH = 50;
const MN_KEYFRAMES_TOKEN = 'keyframes';
const MN_DEFAULT_PRIORITY = -2000;
const MN_DEFAULT_CSS_PRIORITY = MN_DEFAULT_PRIORITY - 2000;
const MN_DEFAULT_OTHER_CSS_PRIORITY = MN_DEFAULT_PRIORITY - 4000;
const splitSpace = splitProvider(/\s+/);
const splitSelector = splitProvider(/\s*,+\s*/);
const joinOnly = joinProvider('');
const joinComma = joinProvider(',');
const __matchName = routeParseProvider('^([a-z]+):name(.*?):suffix$');
const __matchImportant = routeParseProvider('^(.*?):prefix(-i):ni$');
// eslint-disable-next-line
const __matchValue = routeParseProvider('^(([A-Z][a-z]+):camel|((\\-):negative?[0-9\\.]+):num):value([a-z%]+):unit?(.*?):other?$');
const regexpBrowserPrefix = /((\:\:\-?|\:\-)([a-z]+\-)?)/;
const regexpMediaPriority = /^(.*)\^(-?[0-9]+)$/;

const normalizeSelectors = normalizeMapProvider(normalizeSelectorsIteratee);
const normalizeComboNames = normalizeMapProvider((namesMap, name) => {
  return flags(splitSpace(name), namesMap);
});
function normalizeSelectorsIteratee(selectorsMap, selector) {
  forEach(splitSelector(selector), (selector) => {
    flags(variants(selector), selectorsMap);
  });
  return selectorsMap;
}
function __pi(v) {
  return routeParseProvider(v);
}
function __updateClearIteratee(item) {
  item.updated = 0;
}
function __cssReducer(output, v) {
  push(output, v.content);
  return output;
}
function parseMediaValue(v) {
  if (!v) return 0;
  if (isNaN(v = parseInt(v))) {
    throw new TypeError('parseMediaValue error');
  }
  return v;
}
function parseMediaPart(mediaPart) {
  if (!mediaPart) return;
  const parts = mediaPart.split('-');
  return parts.length > 1 ? {
    min: parseMediaValue(parts[0]),
    max: parseMediaValue(parts[1]),
  } : {
    max: parseMediaValue(parts[0]),
  };
}
function handlerWrap(essenceHandler, paramsMatchPath) {
  const parse = paramsMatchPath instanceof Array
    ? aggregate(paramsMatchPath.map(__pi), eachApply)
    : routeParseProvider(paramsMatchPath);
  return (p) => {
    parse(p.suffix, p);
    return essenceHandler(p);
  };
}
function __compilerClear(compiler) {
  compiler.clear();
}
function __compilerRecompile(compiler) {
  compiler._recompile();
}
function __compilerCompile(compiler) {
  compiler._compile();
}
function __normalize(essence) {
  if (!essence) return essence;
  const {selectors, exts, include} = essence;
  essence.selectors = selectors ? normalizeSelectors(selectors) : {'': 1};
  exts && (essence.exts = normalizeComboNames(exts));
  include && (essence.include = normalizeInclude(include));
  forIn(essence.childs, __normalize);
  forIn(essence.media, __normalize);
  return essence;
}
function normalizeMapProvider(iteratee) {
  return (names) => isObject(names)
    ? reduce(isArray(names) ? names : keys(names), iteratee, {})
    : iteratee({}, names);
}
function normalizeIncludeIteratee(names, name) {
  return pushArray(names, splitSpace(name));
}
function normalizeInclude(names) {
  return isArray(names)
    ? reduce(names, normalizeIncludeIteratee, [])
    : splitSpace(names);
}
function __priotitySort(a, b) {
  return a.priority - b.priority;
}
function getEessenceSelectors(selectorsMap) {
  const specifics = {}, other = [], outputSelectors = []; // eslint-disable-line
  let matchs, prefix, selector; // eslint-disable-line
  for (selector in selectorsMap) push( // eslint-disable-line
    (matchs = regexpBrowserPrefix.exec(selector))
      ? (specifics[prefix = matchs[3]] || (specifics[prefix] = []))
      : other, selector);
  // eslint-disable-next-line
  for (selector in specifics) push(outputSelectors, specifics[selector]);
  other.length && push(outputSelectors, other);
  return outputSelectors;
}
function __mergeDepth(src, dst) {
  return mergeDepth(src, dst, MN_MERGE_DEPTH);
}

module.exports = (options) => {
  function setPresets(presets) {
    eachTry(presets, [mn]);
  }
  function styleRender() {
    emit(__values($$stylesMap).sort(__priotitySort));
    forIn($$stylesMap, __updateClearIteratee);
  }
  function updateOptions() {
    const options = mn.options || {};
    $$selectorPrefix = options.selectorPrefix || '';
  }
  function mn(essencePath, extendedEssence, paramsMatchPath) {
    const type = typeof essencePath;
    if (type === OBJECT) {
      forIn(essencePath, baseSetMapIteratee);
      return mn;
    }
    if (!essencePath || type !== STRING) {
      console.warn('MN: essencePath value must be an string', essencePath);
      return mn;
    }
    mnBaseSet(extendedEssence, essencePath, paramsMatchPath);
    return mn;
  };
  mn.set = mn;

  function mnBaseSet(extendedEssence, essencePath, paramsMatchPath) {
    const type = typeof(extendedEssence);
    type === FUNCTION
      ? (
        $$handlerMap[essencePath] = paramsMatchPath
          ? handlerWrap(extendedEssence, paramsMatchPath)
          : extendedEssence
      )
      : (
        type === OBJECT
          ? baseSetEssense(essencePath, extendedEssence)
          : (
            type === STRING
              ? baseSetEssense(essencePath, {exts: extendedEssence})
              : console.warn('MN: extendedEssence value must be an object on',
                  extendedEssence, 'where', essencePath)
            )
      );
  }

  function baseSetMapIteratee(extendedEssence, essencePath) {
    isArray(extendedEssence)
      ? mnBaseSet(extendedEssence[0], essencePath, extendedEssence[1])
      : mnBaseSet(extendedEssence, essencePath);
  }

  function baseSetEssenseBase(path, extendedEssence, important) {
    const name = path[0];
    const instance = $$staticsEssences[name]
      || ($$staticsEssences[name] = __normalize({
        inited: 1,
      }));
    important && (instance.important = important);
    baseSet($$staticsEssences, path, __mergeDepth([
      baseGet($$staticsEssences, path),
      __normalize(extendedEssence),
    ], {}));
  }

  function baseSetEssense(_essencePath, extendedEssence) {
    var //eslint-disable-line
      essencePath = _essencePath.split('.'),
      essenceName = essencePath[0],
      path = [essenceName],
      i = 1, l = essencePath.length;
    for (;i < l; i++) push(path, 'childs', essencePath[i]);
    baseSetEssenseBase(path, extendedEssence);
    // for important
    path[0] = essenceName + '-i';
    baseSetEssenseBase(path, extendedEssence, 1);
  }

  selectorsCompileProvider(mn);
  const parseComboNameProvider = mn.parseComboNameProvider;
  const __parseComboName = mn.parseComboName;

  // eslint-disable-next-line
  const updateAttrByMap = mn.updateAttrByMap = withResult((comboNamesMap, attrName) => {
    let parseComboName = parseComboNameProvider(attrName), comboName; // eslint-disable-line
    for (comboName in comboNamesMap) forEach( // eslint-disable-line
        parseComboName(comboName), updateSelectorIteratee,
    );
  }, mn);
  // eslint-disable-next-line
  const updateAttrByValues = mn.updateAttrByValues = withResult((comboNames, attrName) => {
    const parseComboName = parseComboNameProvider(attrName);
    forEach(comboNames, (comboName) => {
      forEach(parseComboName(comboName), updateSelectorIteratee);
    });
  }, mn);

  mn.recompileFrom = withResult((attrsMap) => {
    __clear();
    updateOptions();
    keyframesRender();
    setStyle(
        'css',
        joinOnly(reduce($$css.map, __cssReducer, [])),
        MN_DEFAULT_CSS_PRIORITY,
    );
    forIn(attrsMap, updateAttrByMap);
    forIn($$root, __mode);
    styleRender();
  }, mn);

  function __compileProvider(attrName) {
    function instance(v) {
      // eslint-disable-next-line
      for (var vls = splitSpace(v || ''), i = 0, l = vls.length; i < l; i++) {
        if ((v = vls[i]) && !cache[v]) {
          cache[v] = 1;
          push(newValues, v);
        }
      }
    }
    let newValues;
    (instance.clear = () => {
      cache = instance.cache = {};
      newValues = [];
    })();
    instance._compile = () => {
      const _values = newValues;
      newValues = [];
      updateAttrByValues(_values, attrName);
    };
    instance._recompile = () => {
      updateAttrByMap(cache, attrName);
    };
    instance.checkNode = (node) => {
      node.getAttribute && instance(node.getAttribute(attrName));
    };
    instance.recursiveCheck = recursiveCheckNode;
    function recursiveCheckNode(node) {
      node.getAttribute && instance(node.getAttribute(attrName));
      forEach(node.childNodes, recursiveCheckNode);
    }
    return instance;
  };
  const getCompiler = mn.getCompiler = (attrName) => $$compilers[attrName]
    || ($$compilers[attrName] = __compileProvider(attrName));

  mn.recursiveCheckByAttrs = withResult((node, attrs) => {
    eachApply( // eslint-disable-next-line
        map(map(isString(attrs) ? [attrs] : attrs, getCompiler), 'recursiveCheck'),
        [node],
    );
  }, mn);
  mn.checkOneNodeByAttrs = withResult((node, attrs) => {
    eachApply(
        map(map(isString(attrs) ? [attrs] : attrs, getCompiler), 'checkNode'),
        [node],
    );
  }, mn);
  mn.checkByAttrs = withResult((v, attrs) => {
    isString(attrs)
        ? getCompiler(attrs)(v)
        : eachApply(map(attrs, getCompiler), [v]);
  }, mn);

  function setStyle(name, content, priority) {
    $$stylesMap[name] = {
      name,
      priority: priority || 0,
      content: content || '',
      updated: 1,
    };
    $$updated = 1;
    return mn;
  }
  mn.setStyle = (name, content, priority) => setStyle(
      name, content, priority || MN_DEFAULT_OTHER_CSS_PRIORITY,
  );

  const $$data = mn.data = {};
  const $$compilers = $$data.compilers = {};
  const cssPropertiesStringify = mn.propertiesStringify
    = cssPropertiesStringifyProvider();
  const emit = (mn.emitter = new Emitter([])).emit;
  let $$updated;
  let $$essences;
  let $$root;
  let $$statics;
  let $$assigned;
  let $$staticsEssences;
  let $$keyframes;
  let $$css;
  let $$stylesMap = $$data.stylesMap = {};
  let $$media = mn.media = {};
  let $$handlerMap = mn.handlerMap = {};
  let $$force;
  let $$selectorPrefix;

  const parseMediaName = mn.parseMediaName = (mediaName) => {
    if (!mediaName || mediaName === 'all') {
      return {
        priority: MN_DEFAULT_PRIORITY,
      };
    }
    const media = $$media[mediaName];
    const selector = media && media.selector || '';
    let query = media && media.query || '';
    let priority = media && media.priority;
    if (query) {
      return {
        query,
        selector,
        priority: priority || 0,
      };
    }

    // get media priority
    const priorityMatch = regexpMediaPriority.exec(mediaName);
    if (priorityMatch) {
      mediaName = priorityMatch[1];
      priority = parseInt(priorityMatch[2]);
    }

    if (priority === 0) priority--;

    try {
      if (mediaName === 'x') throw new TypeError('empty parts');
      const mediaParts = mediaName.split('x');
      let v, mp; //eslint-disable-line

      if (mp = parseMediaPart(mediaParts[0])) {
        if (v = mp.min) {
          query += '(min-width: ' + v + 'px)';
        }
        if (v = mp.max) {
          priority = priority || -v;
          if (query) query += ' and ';
          query += '(max-width: ' + v + 'px)';
        }
      }

      if (mp = parseMediaPart(mediaParts[1])) {
        if (v = mp.min) {
          if (query) query += ' and ';
          query += '(min-height: ' + v + 'px)';
        }
        if (v = mp.max) {
          priority = priority || -v;
          if (query) query += ' and ';
          query += '(max-height: ' + v + 'px)';
        }
      }
    } catch (ex) {
      query = mediaName;
    }

    priority = priority || MN_DEFAULT_PRIORITY;
    priority++;

    return {query, selector, priority};
  };

  function __mode(context, mediaName) {
    function prefixIteratee(selector) {
      return selectorPrefix + selector;
    }
    const media = parseMediaName(mediaName);
    const mediaQuery = media.query;
    const mediaSelector = media.selector;
    const mediaPriority = media.priority;
    const selectorPrefix = ($$selectorPrefix || '')
      + (mediaSelector ? (mediaSelector + ' ') : '');
    const selectorsIteratee = selectorPrefix
      ? ((selectors) => joinComma(map(selectors, prefixIteratee)) + cssText)
      : ((selectors) => joinComma(selectors) + cssText);

    // eslint-disable-next-line
    let essenceName, contextEssence, essence, cssText, output, isContinue = 1;
    for (essenceName in context) {
      if ((contextEssence = context[essenceName]) && contextEssence.updated) {
        isContinue = 0;
        cssText = contextEssence.cssText;
        contextEssence.content = cssText ? joinOnly(map(
            getEessenceSelectors(contextEssence.map),
            selectorsIteratee,
        )) : '';
        delete contextEssence.updated;
      }
    }
    if (isContinue) return;

    output = joinOnly(map(__values(context).sort(__priotitySort), 'content'));
    if (mediaQuery && output) {
      output = joinOnly(['@media ', mediaQuery, '{', output, '}']);
    }
    setStyle('media.' + mediaName, output, mediaPriority);
  }

  function __assignCore(comboNames, selectors, defaultMediaName, excludes) {
    defaultMediaName = defaultMediaName || 'all';
    let name, selector, l, i, items, essenceName, item, // eslint-disable-line
      essencesNames, childSelectors, mediaName, actx; // eslint-disable-line
    for (name in comboNames) { // eslint-disable-line
      for (selector in selectors) { // eslint-disable-line
        for (
          items = __parseComboName(name, selector), l = items.length, i = 0;
          i < l;
          i++
        ) {
          item = items[i];
          essencesNames = item[SC_ESSENCES];
          childSelectors = item[SC_SELECTORS];
          mediaName = item[SC_MEDIA_NAME] || defaultMediaName;
          actx = $$assigned[mediaName] || ($$assigned[mediaName] = {});
          for (essenceName in essencesNames) { // eslint-disable-line
            extend(
                actx[essenceName] || (actx[essenceName] = {}),
                childSelectors,
            );
            updateEssence(essenceName, childSelectors, mediaName, excludes);
          }
        }
      }
    }
  }

  mn.assign = withResult((selectors, comboNames, defaultMediaName) => {
    function iteratee(comboNames, s) {
      __assignCore(
          normalizeComboNames(comboNames),
          normalizeSelectors(s),
          defaultMediaName,
      );
    }
    isPlainObject(selectors)
      ? forIn(selectors, iteratee)
      : iteratee(comboNames, selectors);
  }, mn);

  function __initEssence(input) {
    const params = {
      input,
      prefix: input,
      name: input,
      suffix: '',
      ni: '',
    };
    __matchImportant(input, params);
    __matchName(params.prefix, params);
    __matchValue(params.suffix, params);

    const important = !!params.ni;
    const essence = ($$handlerMap[params.name] || noop)(params);
    essence && (essence.important = important);
    return essence;
  }
  function initEssence(essenceName, essence, excludes) {
    let _essence;
    const staticEssence = $$staticsEssences[essenceName];
    const tmpEssence = staticEssence
      ? (
        staticEssence.inited
          ? staticEssence
          : (_essence = __initEssence(essenceName))
            && __mergeDepth([staticEssence, __normalize(_essence)], {})
      )
      : __normalize(__initEssence(essenceName));

    if (!tmpEssence) return essence;
    compileMixedEssence(essence, tmpEssence, excludes);
    const important = essence.important;

    function __childsHandle(childs, separator, withStatic) {
      const __prefix = essenceName + separator;
      forIn(childs, withStatic ? (_childEssence, _childName) => {
        const childEssenceName = __prefix + _childName;
        const childStaticEssence = $$staticsEssences[childEssenceName];
        childs[_childName] = compileMixedEssence(
            $$essences[childEssenceName] = {},
            childStaticEssence
              ? (childStaticEssence.inited
                  ? childStaticEssence
                  : __mergeDepth([childStaticEssence, _childEssence], {}))
              : _childEssence,
            excludes, important,
        );
      } : (_childEssence, _childName) => {
        childs[_childName] = compileMixedEssence(
            $$essences[__prefix + _childName] = {},
            _childEssence,
            excludes, important,
        );
      });
    }
    __childsHandle(essence.childs, '.');
    __childsHandle(essence.media, '@', 1);
  }
  function compileMixedEssence(dst, src, excludes, important) {
    const include = src.include;
    let // eslint-disable-line
      i = include && include.length,
      mergingMixins, style;
    if (i) {
      mergingMixins = new Array(i + 1);
      mergingMixins[i] = src;
      // eslint-disable-next-line
      for (; i--;) mergingMixins[i] = updateEssence(include[i], {}, '', excludes);
      __mergeDepth(mergingMixins, dst);
    } else {
      extend(dst, src);
    }

    dst.cssText = (style = dst.style)
      && (style = cssPropertiesStringify(style, dst.important || important))
      ? ('{' + style + '}') : '';
    dst.inited = 1;
    return dst;
  }
  function createContextEssence(essenceName, essence, excludes) {
    essence.inited || initEssence(essenceName, essence, excludes);
    return {
      priority: essence.priority || 0,
      selectors: essence.selectors,
      cssText: essence.cssText,
      map: {},
    };
  }
  function updateEssence(
      essenceName, selectors, mediaName, _excludes, essence,
  ) {
    const excludes = extend({}, _excludes);
    if (excludes[essenceName]) return;
    mediaName = mediaName || 'all';
    excludes[essenceName] = 1;
    essence || (essence = $$essences[essenceName]
      || ($$essences[essenceName] = {}));
    const context = $$root[mediaName] || ($$root[mediaName] = {});
    const contextEssence = context[essenceName] || (context[essenceName]
      = createContextEssence(essenceName, essence, excludes));
    contextEssence.updated = 1;
    extend(
        contextEssence.map,
        selectors = joinMaps({}, selectors, contextEssence.selectors),
    );
    function __childsHandle(childs, separator) {
      let childName;
      for (childName in childs) updateEssence( // eslint-disable-line
          essenceName + separator + childName,
          selectors,
          mediaName,
          excludes,
          childs[childName],
      );
    }
    const {childs, media, exts} = essence;
    childs && __childsHandle(childs, '.');
    media && __childsHandle(media, '@');
    exts && __assignCore(exts, selectors, mediaName, excludes);
    return essence;
  }
  function updateSelectorIteratee([essences, selectors, mediaName]) {
    let essenceName;
    for (essenceName in essences) updateEssence( // eslint-disable-line
        essenceName,
        selectors,
        mediaName,
    );
  }

  function __ctx(src) {
    src = src || {};
    src.map = src.map || {};
    return src;
  }
  function __assignItemCompile(actx, mediaName) {
    forIn(actx, (selectors, essenceName) => {
      updateEssence(essenceName, selectors, mediaName);
    });
  }
  function __clear() {
    $$media = mn.media || (mn.media = {});
    $$handlerMap = mn.handlerMap || (mn.handlerMap = {});
    $$essences = $$data.essences = {};
    $$root = $$data.root = {};
    $$statics = $$data.statics || ($$data.statics = {});
    $$staticsEssences = $$statics.essences || ($$statics.essences = {});
    $$keyframes = $$data.keyframes = __ctx($$data.keyframes);
    $$css = $$data.css = __ctx($$data.css);
    $$stylesMap = $$data.stylesMap = {};
    forIn(
        $$assigned = $$statics.assigned || ($$statics.assigned = {}),
        __assignItemCompile,
    );
  }
  __clear();
  mn.clear = withResult(() => {
    forIn($$compilers, __compilerClear);
    __clear();
  }, mn);

  const keyframesRender = mn.keyframesCompile = withResult(() => {
    $$keyframes.updated = 0;
    const keyframesPrefix = MN_KEYFRAMES_TOKEN + ' ';
    const prefixes = cssPropertiesStringify.prefixes;
    // eslint-disable-next-line
    setStyle(MN_KEYFRAMES_TOKEN, joinOnly(reduce($$keyframes.map, (output, v, k) => {
      let prefix;
      for (prefix in prefixes) push( // eslint-disable-line
          output, '@' + prefix + keyframesPrefix + k + v,
      );
      push(output, '@' + keyframesPrefix + k + v);
      return output;
    }, [])), MN_DEFAULT_CSS_PRIORITY);
  }, mn);
  const cssRender = mn.cssCompile = withResult(() => {
    $$css.updated = 0;
    // eslint-disable-next-line
    setStyle('css', joinOnly(reduce($$css.map, __cssReducer, [])), MN_DEFAULT_CSS_PRIORITY);
  }, mn);
  const __render = mn.compile = withResult(() => {
    updateOptions();
    $$keyframes.updated && keyframesRender();
    $$css.updated && cssRender();
    if ($$force) {
      __clear();
      forIn($$compilers, __compilerRecompile);
    } else {
      forIn($$compilers, __compilerCompile);
    }
    forIn($$root, __mode);
    $$updated && styleRender();
    $$updated = $$force = 0;
  }, mn);
  mn.recompile = withResult(() => {
    $$force = 1;
    __render();
  }, mn);
  const deferCompile = mn.deferCompile = withDefer(__render, mn);
  mn.deferRecompile = () => {
    $$force = 1;
    return deferCompile();
  };
  mn.setKeyframes = withResult((name, body) => {
    const map = $$keyframes.map;
    if (body) {
      const output = ['{'];
      isObject(body)
        ? forIn(body, (css, k) => push(output, k + '{'
          + (isObject(css) ? cssPropertiesStringify(css) : css) + '}'),
        )
        : push(output, body);
      push(output, '}');
      map[name] = joinOnly(output);
    } else {
      delete map[name];
    }
    $$keyframes.updated = 1;
  }, mn);
  mn.css = withResult((selector, css) => {
    const map = $$css.map;
    function baseSetCSS(css, s) {
      s = joinComma(keys(normalizeSelectorsIteratee({}, s)));
      if (css) {
        const instance = map[s] || (map[s] = {css: {}});
        instance.content = joinOnly([s, '{', cssPropertiesStringify(
          isObject(css)
            ? extend(instance.css, css)
            : cssPropertiesParse(css, instance.css),
        ), '}']);
      } else {
        delete map[s];
      }
    }
    isObject(selector)
      ? forIn(selector, baseSetCSS)
      : baseSetCSS(css, selector);
    $$css.updated = 1;
  }, mn);

  mn.setPresets = withResult(setPresets, mn);
  mn.utils = utils;

  options = mn.options = options || {};
  isArray(options.presets) && setPresets(options.presets);

  return mn;
};
