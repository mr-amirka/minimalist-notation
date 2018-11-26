/**
 * @overview minimalist-notation
 * @author Absolutely Amir <mr.amirka@ya.ru>
 */
const emitterProvider = require('mn-emitter');
const selectorsCompileProvider = require('./selectors-compile-provider');

const utils = {
  ...require('mn-utils'),
  color: require('./color')
};

const {
  extend,
  isPlainObject,
  isObject,
  isArray,
  set,
  get,
  aggregate,
  eachApply,
  eachTry,
  cloneDepth,
  extendDepth,
  mergeDepth,
  flags,
  joinMaps,
  routeParseProvider,
  forIn,
  forEach,
  reduce,
  cssPropertiesStringifyProvider,
  cssPropertiesParse,
  push,
  pushArray,
  splitProvider,
  joinProvider,
  withDefer,
  withResult
} = utils;


const
  OBJECT = 'object',
  FUNCTION = 'function',
  STRING = 'string';
const
  baseSet = set.base,
  baseGet = get.base;

const __values = Object.values;
const __sort = (a, b) => a.priority - b.priority;
const __updateIteratee = item => item.updated = true;

module.exports = () => {

  const styleRender = () => {
    emit(__values($$stylesMap).sort(__sort));
    forIn($$stylesMap, __updateIteratee);
  };

  const mn = (essencePath, extendedEssence, paramsMatchPath) => {

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

  const mnBaseSet = (extendedEssence, essencePath, paramsMatchPath) => {
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
              ? baseSetEssense(essencePath, { exts: extendedEssence })
              : console.warn('MN: extendedEssence value must be an object on', extendedEssence, 'where', essencePath)
            )
      );
  };

  const baseSetMapIteratee = (extendedEssence, essencePath) => {
    isArray(extendedEssence)
      ? mnBaseSet(extendedEssence[0], essencePath, extendedEssence[1])
      : mnBaseSet(extendedEssence, essencePath)
  };

  const baseSetEssense = (_essencePath, extendedEssence) => {
    const essencePath = _essencePath.split('.');
    const essenceName = essencePath[0];
    const path = [ essenceName ];
    $$staticsEssences[essenceName] || ($$staticsEssences[essenceName] = __normalize({
      inited: true
    }));
    for (let i = 1, l = essencePath.length; i < l; i++) path.push('childs', essencePath[i]);
    baseSet($$staticsEssences, path, __mergeDepth([
      baseGet($$staticsEssences, path),
      __normalize(extendedEssence)
    ], {}));
  };

  selectorsCompileProvider(mn);
  const parseComboNameProvider = mn.parseComboNameProvider;
  const __parseComboName = mn.parseComboName;

  const updateAttrByMap = mn.updateAttrByMap = withResult((comboNamesMap, attrName) => {
    const parseComboName = parseComboNameProvider(attrName);
    for (comboName in comboNamesMap) updateSelector(parseComboName(comboName));
  }, mn);
  const updateAttrByValues = mn.updateAttrByValues = withResult((comboNames, attrName) => {
    const parseComboName = parseComboNameProvider(attrName);
    forEach(comboNames, (comboName) => {
      updateSelector(parseComboName(comboName))
    });
  }, mn);
  mn.recompileFrom = withResult((attrsMap, options) => {
    options || (options = {});

    __clear();
    keyframesRender();
    setStyle('css', joinOnly(reduce($$css.map, __cssReducer, [])), defaultCCSPriority);
    forIn(attrsMap, updateAttrByMap);
    $$selectorPrefix = options.selectorPrefix || '';
    forIn($$root, __mode);
    styleRender();
  }, mn);
  const __compileProvider = (attrName) => {
    const instance = (v) => {
      v && forEach(splitSpace(v), checkOne);
    };
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
    const checkOne = instance.checkOne = (v) => {
      if (!v || cache[v]) return;
      cache[v] = true;
      push(newValues, v);
    };
    const checkNode = instance.checkNode = (node) => {
      node.getAttribute && instance(node.getAttribute(attrName));
    };
    const recursiveCheckNode = (node) => {
      checkNode(node);
      forEach(node.children, recursiveCheckNode);
    };
    const __recursiveCheckNode = (node) => {
      checkNode(node);
      forEach(node.childNodes, __recursiveCheckNode);
    };
    instance.recursiveCheck = (node) => {
      node.children ? recursiveCheckNode(node) : __recursiveCheckNode(node);
      return mn;
    };
    return instance;
  };
  mn.getCompiler = (attrName) => $$compilers[attrName] || ($$compilers[attrName] = __compileProvider(attrName));

  const setStyle = (name, content, priority) => {
    $$stylesMap[name] = {
      name,
      priority: priority || 0,
      content: content || ''
    };
    $$updated = true;
    return mn;
  };
  mn.setStyle = (name, content, priority) => setStyle(name, content, priority || defaultOtherCCSPriority)
  let $$updated;
  let $$essences;
  let $$root;
  let $$statics;
  let $$assigned;
  let $$staticsEssences;
  let $$keyframes;
  let $$css;
  const $$data = mn.data = {};
  let $$stylesMap = $$data.stylesMap = {};
  let $$media = mn.media = {};
  let $$handlerMap = mn.handlerMap = {};
  let cssPropertiesStringify = mn.propertiesStringify = cssPropertiesStringifyProvider();
  let $$force;
  let $$selectorPrefix;

  const $$compilers = $$data.compilers = {};

  const emit = (mn.emitter = emitterProvider([])).emit;

  const parseMediaName = mn.parseMediaName = (mediaName) => {
    if (!mediaName || mediaName === 'all') return {
      priority: defaultPriority
    };
    const media = $$media[mediaName];
    let query = media && media.query;
    let priority = media && media.priority;
    if (query) {
      return {
        query,
        priority: priority || 0
      };
    }

    if (priority === 0) priority--;

    try {
      if (mediaName === 'x') throw 'empty parts';
      const mediaParts = mediaName.split('x');
      let v, mp;
      query = '';

      if (mp = parseMediaPart(mediaParts[0])) {
        if (v = mp.min) {
          query += '(min-width: ' + v + 'px)';
        }
        if (v = mp.max) {
          priority || (priority = -v);
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
          priority || (priority = -v);
          if (query) query += ' and ';
          query += '(max-height: ' + v + 'px)';
        }
      }
    } catch (ex) {
      return {
        query: mediaName,
        priority: defaultPriority
      };
    }

    priority || (priority = defaultPriority);
    priority++;
    return {query, priority};
  };

  const __mode = (context, mediaName) => {
    const selectorPrefix = $$selectorPrefix || '';
    let isContinue = true;
    let essenceName, contextEssence, essence, selectors;
    for (essenceName in context) {
      if ((contextEssence = context[essenceName]) && contextEssence.updated) {
        isContinue = false;
        contextEssence.content = getEessenceContent(contextEssence.cssText, contextEssence.map, selectorPrefix);
        delete contextEssence.updated;
      }
    }
    if (isContinue) return;
    const media = parseMediaName(mediaName);
    const mediaQuery = media.query;
    const mediaPriority = media.priority;
    const essences = __values(context).sort(__priotitySort);
    const l = essences.length;
    let output = new Array(l);
    for (let i = 0; i < l; i++) output[i] = essences[i].content;
    if (mediaQuery) output = ['@media ', mediaQuery, '{', joinOnly(output), '}'];
    setStyle('media.' + mediaName, joinOnly(output), mediaPriority);
  };

  const __assignCore = (comboNames, selectors, defaultMediaName, excludes) => {
    defaultMediaName || (defaultMediaName = 'all');
    const assignIteratee = (optionsItem) => {
      const childSelectors = optionsItem.selectors;
      const essencesNames = optionsItem.essences;
      const mediaName = optionsItem.mediaName || defaultMediaName;
      const actx = $$assigned[mediaName] || ($$assigned[mediaName] = {});
      for (let essenceName in essencesNames) {
        extend(actx[essenceName] || (actx[essenceName] = {}), childSelectors);
        updateEssence(essenceName, childSelectors, mediaName, excludes);
      }
    };
    for (let comboName in comboNames) {
      for (let selector in selectors) forEach(__parseComboName(comboName, selector), assignIteratee);
    }
  };

  mn.assign = withResult((selectors, comboNames, defaultMediaName) => {
    const __iteratee = (comboNames, s) => {
      __assignCore(comboNames, flags(splitSelector(s)), defaultMediaName);
    };
    isArray(selectors)
      ? (comboNames = normalizeComboNames(comboNames)) && forEach(selectors, s => __iteratee(comboNames, s))
      : (isPlainObject(selectors) ? forIn(selectors, (_comboNames, s) => {
          __iteratee(normalizeComboNames(_comboNames), s);
        }) : __iteratee(normalizeComboNames(comboNames), selectors));
  }, mn);

  const __initEssence = (input) => {
    const params = {
      input,
      prefix: input,
      name: input,
      suffix: ''
    };
    __matchImportant(input, params);
    __matchName(params.prefix, params);
    __matchValue(params.suffix, params);

    /**
     * Исходя из предшествующего опыта,
     * чтобы избавить разработчика от необходимости добалять
     * эту логику руками в каждом отдельном обработчике,
     * параметр params.i добавляется автоматически
     */
    params.ni || (params.ni = '');
    params.i = params.ni ? '!important' : '';

    const handler = $$handlerMap[params.name];
    return handler && handler(params);
  };
  const initEssence = (essenceName, essence, excludes) => {

    const staticEssence = $$staticsEssences[essenceName];
    let _essence;
    const tmpEssence = staticEssence
      ? (
        staticEssence.inited
          ? staticEssence
          : (_essence = __initEssence(essenceName)) && __mergeDepth([ staticEssence, __normalize(_essence) ], {})
      )
      : __normalize(__initEssence(essenceName));

    if (!tmpEssence) return essence;
    compileMixedEssence(essence, tmpEssence, excludes);

    const __childsHandle = (childs, separator, withStatic) => {
      const __prefix = essenceName + separator;
      forIn(childs, withStatic ? (_childEssence, _childName) => {
        const childEssenceName = __prefix + _childName;
        const childStaticEssence = $$staticsEssences[childEssenceName];
        childs[_childName] = compileMixedEssence(
          $$essences[childEssenceName] = {},
          childStaticEssence
            ? (childStaticEssence.inited ? childStaticEssence : __mergeDepth([ childStaticEssence, _childEssence ], {}))
            : _childEssence,
          excludes
        );
      } : (_childEssence, _childName) => {
        childs[_childName] = compileMixedEssence(
          $$essences[__prefix + _childName] = {},
          _childEssence,
          excludes
        );
      });
    };
    __childsHandle(essence.childs, '.');
    __childsHandle(essence.media, '@', true);
  };
  const compileMixedEssence = (dst, src, excludes) => {
    const include = src.include;
    const length = include && include.length;
    if (length) {
      let mergingMixins = new Array(length + 1);
      mergingMixins[length] = src;
      for (let i = length; i--;) mergingMixins[i] = updateEssence(include[i], {}, 'all', excludes);
      __mergeDepth(mergingMixins, dst);
    } else {
      extend(dst, src);
    }
    let style = dst.style;
    dst.cssText = style && (style = cssPropertiesStringify(style)) ? ('{' + style + '}') : '';
    dst.inited = true;
    return dst;
  };
  const createContextEssence = (essenceName, essence, excludes) => {
    essence.inited || initEssence(essenceName, essence, excludes);
    return {
      priority: essence.priority || 0,
      selectors: essence.selectors,
      cssText: essence.cssText,
      map: {}
    };
  };
  const updateEssence = (essenceName, selectors, mediaName, _excludes, essence) => {
    const excludes = extend({}, _excludes);
    if (excludes[essenceName]) return;
    excludes[essenceName] = true;
    essence || (essence = $$essences[essenceName] || ($$essences[essenceName] = {}));
    const context = $$root[mediaName] || ($$root[mediaName] = {});
    const contextEssence = context[essenceName] || (context[essenceName] = createContextEssence(essenceName, essence, excludes));
    contextEssence.updated = true;
    extend(contextEssence.map, selectors = joinMaps({}, selectors, contextEssence.selectors));
    const __childsHandle = (childs, separator) => {
      for (let childName in childs) {
        updateEssence(essenceName + separator + childName, selectors, mediaName, excludes, childs[childName]);
      }
    };
    const { childs, media, exts } = essence;
    childs && __childsHandle(childs, '.');
    media && __childsHandle(media, '@');
    exts && __assignCore(exts, selectors, mediaName, excludes);
    return essence;
  };

  const updateSelectorIteratee = (optionsItem) => {
    const essencesNames = optionsItem.essences;
    const selectors = optionsItem.selectors;
    const mediaName = optionsItem.mediaName;
    for (let essenceName in essencesNames) updateEssence(essenceName, selectors, mediaName);
  };
  const updateSelector = (optionsItems) => {
    forEach(optionsItems, updateSelectorIteratee);
  };

  const __ctx = (src) => {
    src || (src = {});
    src.map || (src.map = {});
    return src;
  };
  const __assignItemCompile = (actx, mediaName) => {
    forIn(actx, (selectors, essenceName) => {
      updateEssence(essenceName, selectors, mediaName);
    });
  };
  const __clear = () => {
    $$media = mn.media || (mn.media = {});
    $$handlerMap = mn.handlerMap || (mn.handlerMap = {});
    $$essences = $$data.essences = {};
    $$root = $$data.root = {};
    $$statics = $$data.statics || ($$data.statics = {});
    $$staticsEssences = $$statics.essences || ($$statics.essences = {});
    $$keyframes = $$data.keyframes = __ctx($$data.keyframes);
    $$css = $$data.css = __ctx($$data.css);
    $$stylesMap = $$data.stylesMap = {};
    forIn($$assigned = $$statics.assigned || ($$statics.assigned = {}), __assignItemCompile);
  };
  __clear();
  mn.clear = withResult(() => {
    forIn($$compilers, __compilerClear);
    __clear();
  }, mn);

  const keyframesToken = 'keyframes';
  const keyframesRender = mn.keyframesCompile = withResult(() => {
    $$keyframes.updated = false;
    const keyframesPrefix = keyframesToken + ' ';
    const prefixes = cssPropertiesStringify.prefixes;
    setStyle(keyframesToken, joinOnly(reduce($$keyframes.map, (output, v, k) => {
      for (let prefix in prefixes) push(output, '@' + prefix + keyframesPrefix + k + v);
      push(output, '@' + keyframesPrefix + k + v);
      return output;
    }, [])), defaultCCSPriority);

  }, mn);
  const cssRender = mn.cssCompile = withResult(() => {
    $$css.updated = false;
    setStyle('css', joinOnly(reduce($$css.map, __cssReducer, [])), defaultCCSPriority);
  }, mn)
  const __render = mn.compile = withResult(() => {
    $$keyframes.updated && keyframesRender();
    $$css.updated && cssRender();
    if ($$force) {
      __clear();
      forIn($$compilers, __compilerRecompile);
    } else {
      forIn($$compilers, __compilerCompile);
    }
    $$selectorPrefix = '';
    forIn($$root, __mode);
    $$updated && styleRender();
    $$updated = $$force = false;
  }, mn);
  mn.recompile = withResult(() => {
    $$force = true;
    __render();
  }, mn);
  const deferCompile = mn.deferCompile = withDefer(__render, mn);
  mn.deferRecompile = () => {
    $$force = true;;
    return deferCompile();
  };

  mn.setKeyframes = withResult((name, body) => {
    let map = $$keyframes.map;
    if (body) {
      const output = [ '{' ];
      isObject(body)
        ? forIn(body, (css, k) => push(output, k + '{' + (isObject(css) ? cssPropertiesStringify(css) : css) + '}'))
        : push(output, body);
      push(output, '}');
      map[name] = joinOnly(output);
    } else {
      delete map[name];
    }
    $$keyframes.updated = true;
  }, mn);

  mn.css = withResult((selector, css) => {
    const map = $$css.map;
    const baseSetCSS = (css, s) => {
      if (css) {
        const instance = map[s] || (map[s] = { css: {} });
        instance.content = joinOnly([ s , '{', cssPropertiesStringify(
          isObject(css)
            ? extend(instance.css, css)
            : cssPropertiesParse(css, instance.css)
        ), '}' ]);
      } else {
        delete map[s];
      }
    };
    isObject(selector) ? forIn(selector, baseSetCSS) : baseSetCSS(css, selector);
    $$css.updated = true;
  }, mn);
  mn.setPresets = withResult((presets) => {
    eachTry(presets, [ mn ]);
  }, mn);
  mn.utils = utils;
  return mn;
};

const __cssReducer = (output, v) => {
  push(output, v.content);
  return output;
};

const defaultPriority = -2000;
const defaultCCSPriority = defaultPriority - 2000;
const defaultOtherCCSPriority = defaultPriority - 4000;

const parseMediaValue = (mediaValue) => {
  if (!mediaValue) return 0;
  const v = parseInt(mediaValue);
  if (isNaN(v)) {
    throw 'parseMediaValue error';
  }
  return v;
};
const parseMediaPart = (mediaPart) => {
  if (!mediaPart) return;
  const parts = mediaPart.split('-');
  if (parts.length > 1) {
    return {
      min: parseMediaValue(parts[0]),
      max: parseMediaValue(parts[1])
    };
  }
  return {
    max: parseMediaValue(parts[0])
  };
};

const __pi = (v) => routeParseProvider(v);
const handlerWrap = (essenceHandler, paramsMatchPath) => {
  const parse = paramsMatchPath instanceof Array
    ? aggregate(paramsMatchPath.map(__pi), eachApply)
    : routeParseProvider(paramsMatchPath);
  return (p) => {
    parse(p.suffix, p);
    return essenceHandler(p);
  };
};

const joinOnly = joinProvider('');
const joinComma = joinProvider(',');

const splitSpace = splitProvider(/\s+/);
const splitSelector = splitProvider(/\s*,+\s*/);
const __matchName = routeParseProvider('^([a-z]+):name(.*?):suffix$');
const __matchImportant = routeParseProvider('^(.*?):prefix(-i):ni$');
const __matchValue = routeParseProvider('^(([A-Z][a-z]+):camel|((\\-):negative?[0-9]+):num):value([a-z%]+):unit?(.*?):other?$');

const __compilerClear = (compiler) => {
  compiler.clear();
};
const __compilerRecompile = (compiler) => {
  compiler._recompile();
};
const __compilerCompile = (compiler) => {
  compiler._compile();
};

const __normalize = (essence) => {
  if (!essence) return essence;
  //essence.style || (essence.style = {});
  const selectors = essence.selectors;
  essence.selectors = selectors ? normalizeSelectors(selectors) : {'': true};

  const exts = essence.exts;
  exts && (essence.exts = normalizeComboNames(exts));

  const include = essence.include;
  include && (essence.include = normalizeInclude(include));

  forIn(essence.childs, __normalize);
  forIn(essence.media, __normalize);
  return essence;
};

const normalizeNamesMapProvider = (_split) => {
  const __iteratee = (names, name) => {
    flags(_split(name), names);
    return names;
  };
  return (_names) => isPlainObject(_names)
    ? _names
    : (isArray(_names) ? reduce(_names, __iteratee, {}) : flags(_split(_names)));
};


const normalizeComboNames = normalizeNamesMapProvider(splitSpace);
const normalizeSelectors = normalizeNamesMapProvider(splitSelector);

const normalizeNamesProvider = (_split) => {
  const __iteratee = (names, name) => {
    pushArray(names, _split(name));
    return names;
  };
  return (_names) => isArray(_names) ? reduce(_names, __iteratee, []) : _split(_names);
};
const normalizeInclude = normalizeNamesProvider(splitSpace);

const __priotitySort = (a, b) => a.priority - b.priority;
const regexpBrowserPrefix = /((\:\:\-?|\:\-)([a-z]+\-)?)/;
const getEessenceContent = (cssText, selectorsMap, selectorPrefix) => {
  if (!cssText) return cssText;
  const specifics = {}, other = [];
  let matchs, prefix, selector;
  for (selector in selectorsMap) push(
    (matchs = regexpBrowserPrefix.exec(selector))
      ? (specifics[prefix = matchs[3]] || (specifics[prefix] = []))
      : other, selectorPrefix + selector);
  const output = [];
  for (selector in specifics) push(output, joinComma(specifics[selector]) + cssText);
  other.length && push(output, joinComma(other) + cssText);
  return joinOnly(output);
};

const __extendDepth = (dst, src) => extendDepth(dst, src, $$mergeDepth);
const __mergeDepth = (src, dst) => mergeDepth(src, dst, $$mergeDepth);
const $$mergeDepth = 50;
//const reNgClass = /"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+)\s*\:/;
