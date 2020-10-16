const Emitter = require('mn-utils/Emitter');
const extend = require('mn-utils/extend');
const isPlainObject = require('mn-utils/isPlainObject');
const isObject = require('mn-utils/isObject');
const isArray = require('mn-utils/isArray');
const isNumber = require('mn-utils/isNumber');
const isEmpty = require('mn-utils/isEmpty');
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
const joinOnly = require('mn-utils/joinOnly');
const joinComma = require('mn-utils/joinComma');
const withDefer = require('mn-utils/withDefer');
const withResult = require('mn-utils/withResult');
const map = require('mn-utils/map');
const __values = require('mn-utils/values');
const merge = require('mn-utils/merge');
const isString = require('mn-utils/isString');
const noop = require('mn-utils/noop');
const variants = require('mn-utils/variants');
const keys = require('mn-utils/keys');
const color = require('mn-utils/color');
const colorGetBackground = require('mn-utils/colorGetBackground');
const {
  SC_ESSENCES,
  SC_SELECTORS,
  SC_MEDIA_NAME,
} = require('./constants');
const selectorsCompileProvider = require('./selectorsCompileProvider');
const selectorNormalize = require('./selectorNormalize');

const utils = MinimalistNotationProvider.utils = merge([
  {
    Emitter: Emitter,
    color,
    colorGetBackground,
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
    isDefined: require('mn-utils/isDefined'),
    isEmpty,
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
    joinProvider: require('mn-utils/joinProvider'),
    joinOnly,
    joinComma,
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
    scopeJoin: require('mn-utils/scopeJoin'),
    scopeSplit: require('mn-utils/scopeSplit'),
    slice: require('mn-utils/slice'),
  },
  require('mn-utils/anyval'),
]);

const // eslint-disable-line
  OBJECT = 'object',
  FUNCTION = 'function',
  STRING = 'string',
  baseSet = set.base,
  baseGet = get.base;

const MN_CONTEXT_ESSENCE_MAP = 0;
const MN_CONTEXT_ESSENCE_SELECTORS = 1;
const MN_CONTEXT_ESSENCE_PRIORITY = 2;
const MN_CONTEXT_ESSENCE_CSS_TEXT = 3;
const MN_CONTEXT_ESSENCE_UPDATED = 4;
const MN_CONTEXT_ESSENCE_CONTENT = 5;

const MN_MERGE_DEPTH = 50;
const MN_KEYFRAMES_TOKEN = 'keyframes';
const MN_DEFAULT_PRIORITY = -2000;
const MN_DEFAULT_CSS_PRIORITY = MN_DEFAULT_PRIORITY - 2000;
const MN_DEFAULT_OTHER_CSS_PRIORITY = MN_DEFAULT_PRIORITY - 4000;
const splitSpace = splitProvider(/\s+/);
const splitSelector = splitProvider(/\s*,+\s*/);
const regexpMatchName = /^([a-z]+)(.*)$/;
const regexpMatchImportant = /^(.*)(-i)$/;
const regexpMatchValue = /^((([A-Z][A-Za-z]*)|((-)?[0-9.]+))([a-z%]+)?)?(.*)?$/;
const regexpBrowserPrefix = /((\:\:\-?|\:\-)([a-z]+\-)?)/;
const regexpMediaPriority = /^(.*)\^(-?[0-9]+)$/;
const regexpImportant = /-i$/;

const normalizeSelectors = normalizeMapProvider(normalizeSelectorsIteratee);
const normalizeComboNames = normalizeMapProvider((namesMap, name) => {
  return flags(splitSpace(name), namesMap);
});
function normalizeSelectorsIteratee(selectorsMap, selector) {
  forEach(splitSelector(selector), (selector) => {
    flags(map(variants(selector), selectorNormalize), selectorsMap);
  });
  return selectorsMap;
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
function parseMediaPart(mediaPart, parts, v) {
  return mediaPart && (
    parts = mediaPart.split('-'),
    v = parseMediaValue(parts[0]),
    parts.length > 1
      ? [v, parseMediaValue(parts[1])]
      : [0, v]
  );
}
function handlerWrap(essenceHandler, paramsMatchPath) {
  const parse = isArray(paramsMatchPath)
    ? aggregate(map(paramsMatchPath, routeParseProvider), eachApply)
    : routeParseProvider(paramsMatchPath);
  return (p) => {
    parse(p.suffix, p);
    return essenceHandler(p);
  };
}
function iterateeAddImportant(v) {
  v.important = 1;
}
function iterateeCheckImportant(a, v, k) {
  a[__iterateeCheckImportant(k)] = v;
  return a;
}
function __iterateeCheckImportant(v) {
  return regexpImportant.test(v) ? v : (v + '-i');
}
function __normalize(essence) {
  if (!essence) return essence;
  const {selectors, exts, include, important} = essence;
  function childAddNormalize(childs) {
    important && forIn(childs, iterateeAddImportant);
    forIn(childs, __normalize);
  }
  essence.selectors = selectors ? normalizeSelectors(selectors) : {'': 1};
  exts && (
    essence.exts = important
      ? reduce(normalizeComboNames(exts), iterateeCheckImportant, {})
      : normalizeComboNames(exts)
  );
  include && (
    essence.include = important
      ? map(normalizeInclude(include), __iterateeCheckImportant)
      : normalizeInclude(include)
  );
  childAddNormalize(essence.childs);
  childAddNormalize(essence.media);
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
function priotitySort(a, b) {
  return a.priority - b.priority;
}
function priotitySortContext(a, b) {
  return a[MN_CONTEXT_ESSENCE_PRIORITY] - b[MN_CONTEXT_ESSENCE_PRIORITY];
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
function __compileProvider(attrName) {
  let _cache, _values; // eslint-disable-line
  function recursiveCheckNode(node) {
    node.getAttribute && instance(node.getAttribute(attrName));
    forEach(node.childNodes, recursiveCheckNode);
  }
  function instance(v) {
    if (!v) return;
    // eslint-disable-next-line
    for (var vs = splitSpace(v || ''), i = 0, l = vs.length, k; i < l; i++) {
      _cache[k = vs[i]] || (
        _cache[k] = 1,
        push(_values, k)
      );
    }
  }
  (instance.clear = () => {
    _cache = instance.cache = {};
    _values = [];
  })();
  instance.getNext = (node) => {
    const values = _values;
    _values = [];
    return values;
  };
  instance.checkNode = (node) => {
    node.getAttribute && instance(node.getAttribute(attrName));
  };
  instance.recursiveCheck = recursiveCheckNode;
  return instance;
}
function MinimalistNotationProvider(options) {
  function setPresets(presets) {
    isArray(presets) && eachTry(presets, [mn]);
  }
  function styleRender() {
    emit(__values($$stylesMap).sort(priotitySort));
  }
  function updateOptions() {
    const options = mn.options || {};
    $$selectorPrefix = options.selectorPrefix || '';
    $$altColor = options.altColor !== 'off';
  }
  function mn(essencePath, extendedEssence, paramsMatchPath, skip) {
    const type = typeof essencePath;
    type === OBJECT
      ? forIn(essencePath, baseSetMapIteratee)
      : (
        !essencePath || type !== STRING
          ? console.warn('MN: essencePath value must be an string', essencePath)
          : mnBaseSet(extendedEssence, essencePath, paramsMatchPath, skip)
      );
    return mn;
  };
  mn.set = mn;

  function mnBaseSet(extendedEssence, essencePath, paramsMatchPath, skip, v) {
    const type = typeof(extendedEssence);
    type === FUNCTION
      ? (
        $$handlerMap[essencePath] = paramsMatchPath
          ? (
            v = handlerWrap(extendedEssence, paramsMatchPath),
            v.skip = skip || 0,
            v
          )
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

  function baseSetEssenseBase(name, path, extendedEssence) {
    $$staticsEssences[name] || ($$staticsEssences[name] = __normalize({
      inited: 1,
    }));
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
    baseSetEssenseBase(essenceName, path, extendedEssence);
    // for important
    baseSetEssenseBase(
        path[0] = essenceName + '-i', path,
        extend(extend({}, extendedEssence), {important: 1}),
    );
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
    setStyle(
        'css',
        joinOnly(reduce($$css.map, __cssReducer, [])),
        MN_DEFAULT_CSS_PRIORITY,
    );
    forIn(attrsMap, updateAttrByMap);
    forIn($$root, __mode);
    keyframesRender();
    styleRender();
  }, mn);

  function getCompiler(attrName) {
    return $$compilers[attrName]
      || ($$compilers[attrName] = __compileProvider(attrName));
  }

  mn.getCompiler = getCompiler;
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
      revision: ++$$revision,
    };
    $$updated = 1;
    return mn;
  }
  mn.setStyle = (name, content, priority) => setStyle(
      name, content, priority || MN_DEFAULT_OTHER_CSS_PRIORITY,
  );

  options = mn.options = options || {};
  const $$data = mn.data = {};
  const $$compilers = $$data.compilers = {};
  const cssPropertiesStringify = mn.propertiesStringify
    = cssPropertiesStringifyProvider();
  const emit = (mn.emitter = new Emitter([])).emit;
  let $$updated;
  let $$essences;
  let $$root;
  let $$statics;
  let $$staticsAssigned;
  let $$staticsEssences;
  let $$keyframes;
  let $$css;
  let $$stylesMap = $$data.stylesMap = {};
  let $$assigned = $$data.assigned = {};
  let $$media = mn.media = options.media || {};
  let $$handlerMap = mn.handlerMap = {};
  let $$force;
  let $$selectorPrefix;
  let $$altColor;
  let $$revision = 0;

  function parseMediaName(mediaName) {
    if (!mediaName || mediaName === 'all') {
      return [MN_DEFAULT_PRIORITY];
    }
    const media = $$media[mediaName];
    const selector = media && media.selector || '';
    let // eslint-disable-line
      priorityMatch, v, mp,
      query = media && media.query || '',
      priority = media && media.priority;
    if (query || selector) {
      return [
        priority || 0,
        query,
        selector,
      ];
    }

    // get media priority
    if (priorityMatch = regexpMediaPriority.exec(mediaName)) {
      mediaName = priorityMatch[1];
      priority = parseInt(priorityMatch[2]);
    }
    if (priority === 0) priority--;

    try {
      if (mediaName === 'x') throw new TypeError('empty parts');
      const mediaParts = mediaName.split('x');

      if (mp = parseMediaPart(mediaParts[0])) {
        if (v = mp[0]) {
          query += '(min-width: ' + v + 'px)';
        }
        if (v = mp[1]) {
          priority = priority || -v;
          if (query) query += ' and ';
          query += '(max-width: ' + v + 'px)';
        }
      }

      if (mp = parseMediaPart(mediaParts[1])) {
        if (v = mp[0]) {
          if (query) query += ' and ';
          query += '(min-height: ' + v + 'px)';
        }
        if (v = mp[1]) {
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

    return [priority, query, selector];
  }
  mn.parseMediaName = parseMediaName;

  function __mode(context, mediaName) {
    function prefixIteratee(selector) {
      return selectorPrefix + selector;
    }
    const media = parseMediaName(mediaName);
    const [mediaPriority, mediaQuery, mediaSelector] = media;
    const selectorPrefix = ($$selectorPrefix || '')
      + (mediaSelector ? (mediaSelector + ' ') : '');
    const selectorsIteratee = selectorPrefix
      ? ((selectors) => joinComma(map(selectors, prefixIteratee)) + cssText)
      : ((selectors) => joinComma(selectors) + cssText);

    // eslint-disable-next-line
    let essenceName, contextEssence, essence, cssText, output, isContinue = 1;
    for (essenceName in context) { // eslint-disable-line
      (contextEssence = context[essenceName])
        && contextEssence[MN_CONTEXT_ESSENCE_UPDATED]
        && (
          isContinue = 0,
          cssText = contextEssence[MN_CONTEXT_ESSENCE_CSS_TEXT],
          contextEssence[MN_CONTEXT_ESSENCE_CONTENT] = cssText ? joinOnly(map(
              getEessenceSelectors(contextEssence[MN_CONTEXT_ESSENCE_MAP]),
              selectorsIteratee,
          )) : '',
          contextEssence[MN_CONTEXT_ESSENCE_UPDATED] = 0
        );
    }
    isContinue || (
      output = joinOnly(map(
          __values(context).sort(priotitySortContext),
          MN_CONTEXT_ESSENCE_CONTENT,
      )),
      mediaQuery && output
        && (output = joinOnly(['@media ', mediaQuery, '{', output, '}'])),
      setStyle('media.' + mediaName, output, mediaPriority)
    );
  }

  function __assignCore(
      assigned, comboNames, selectors, defaultMediaName, excludes,
  ) {
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
          actx = assigned[mediaName] || (assigned[mediaName] = {});
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
          $$staticsAssigned,
          normalizeComboNames(comboNames),
          normalizeSelectors(s),
          defaultMediaName,
      );
    }
    isPlainObject(selectors)
      ? forIn(selectors, iteratee)
      : iteratee(comboNames, selectors);
  }, mn);

  function __initEssence(suffix, matchs, ni, name, handle, essence, params) {
    return (matchs = regexpMatchName.exec(suffix)) && (
      name = matchs[1],
      (matchs = regexpMatchImportant.exec(suffix = matchs[2])) && (
        suffix = matchs[1],
        ni = matchs[2]
      ),
      (handle = $$handlerMap[name]) && (
        params = {
          name: name,
          suffix: suffix,
          ni: ni || '',
        },
        handle.skip || (matchs = regexpMatchValue.exec(suffix)) && (
          params.value = matchs[2],
          params.camel = matchs[3],
          params.num = matchs[4],
          params.negative = matchs[5],
          params.unit = matchs[6],
          params.other = matchs[7]
        ),
        (essence = handle(params)) && (essence.important = ni ? 1 : 0),
        essence
      )
    );
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

    if (!tmpEssence) return;
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
    return [
      {},
      essence.selectors,
      essence.priority || 0,
      essence.cssText,
      0,
      0,
    ];
  }
  function updateEssence(
      essenceName, selectors, mediaName, _excludes, essence,
  ) {
    const excludes = extend({}, _excludes);
    if (excludes[essenceName]) return;
    mediaName = mediaName || 'all';
    excludes[essenceName] = 1;
    essence || (essence = $$essences[essenceName] || {});
    const context = $$root[mediaName] || ($$root[mediaName] = {});
    const contextEssence = context[essenceName] || (context[essenceName]
      = createContextEssence(essenceName, essence, excludes));

    isEmpty(essence) || ($$essences[essenceName] = essence);

    contextEssence[MN_CONTEXT_ESSENCE_UPDATED] = 1;
    extend(
        contextEssence[MN_CONTEXT_ESSENCE_MAP],
        selectors = joinMaps(
            {}, selectors, contextEssence[MN_CONTEXT_ESSENCE_SELECTORS],
        ),
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
    exts && __assignCore($$assigned, exts, selectors, mediaName, excludes);
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
    $$keyframes = $$data.keyframes || ($$data.keyframes = [{}, 0]);
    $$css = $$data.css = $$data.css || [{}, 0];
    $$stylesMap = $$data.stylesMap = {};
    $$assigned = $$data.assigned = {};
    forIn(
        $$staticsAssigned = $$statics.assigned || ($$statics.assigned = {}),
        __assignItemCompile,
    );
  }
  __clear();
  mn.clear = withResult((attrName) => {
    // eslint-disable-next-line
    for (attrName in $$compilers) $$compilers[attrName].clear();
    __clear();
  }, mn);

  const keyframesRender = mn.keyframesCompile = withResult(() => {
    $$keyframes[1] = 0;
    const keyframesPrefix = MN_KEYFRAMES_TOKEN + ' ';
    const prefixes = cssPropertiesStringify.prefixes;
    // eslint-disable-next-line
    setStyle(MN_KEYFRAMES_TOKEN, joinOnly(reduce($$keyframes[0], (output, v, k) => {
      let prefix;
      for (prefix in prefixes) push( // eslint-disable-line
          output, '@' + prefix + keyframesPrefix + k + v,
      );
      push(output, '@' + keyframesPrefix + k + v);
      return output;
    }, [])), MN_DEFAULT_CSS_PRIORITY);
  }, mn);
  const cssRender = mn.cssCompile = withResult(() => {
    $$css[1] = 0;
    // eslint-disable-next-line
    setStyle('css', joinOnly(reduce($$css[0], __cssReducer, [])), MN_DEFAULT_CSS_PRIORITY);
  }, mn);
  const __render = mn.compile = withResult((attrName) => {
    updateOptions();
    if ($$force) {
      __clear();
      // eslint-disable-next-line
      for (attrName in $$compilers) {
        updateAttrByMap($$compilers[attrName].cache, attrName);
      }
    } else {
      // eslint-disable-next-line
      for (attrName in $$compilers) {
        updateAttrByValues($$compilers[attrName].getNext(), attrName);
      }
    }
    $$keyframes[1] && keyframesRender();
    $$css[1] && cssRender();
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
  mn.setKeyframes = withResult((name, body, ifEmpty, map, output) => {
    map = $$keyframes[0];
    if (ifEmpty && map[name]) return;
    if (body) {
      output = ['{'];
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
    $$keyframes[1] = 1;
  }, mn);
  mn.css = withResult((selector, css) => {
    const map = $$css[0];
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
    $$css[1] = 1;
  }, mn);

  mn.setPresets = withResult(setPresets, mn);
  mn.utils = extend(extend({}, utils), {
    color: (v) => color(v, $$altColor),
    colorGetBackground: (v) => colorGetBackground(v, $$altColor),
  });

  setPresets(options.presets);

  return mn;
}

module.exports = MinimalistNotationProvider;
