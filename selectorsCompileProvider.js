/**
 * @overview minimalist-notation/selectors
 * Генеририрует селекторы в Minimalist Notation
 * @author Absolutely Amir <mr.amirka@ya.ru>
 *
 * // изменил порядок деления контекста на родительскиеи дочериние,
 * чтобы было удобнее в нотации юзать такие штуки:
 * //(cF<.parent1|f30<.parent2)>.child1
 */

const {
  extend,
  unslash,
  escapedSplitProvider,
  joinMaps,
  escapedBreakupProvider,
  variance,
  reduce,
  push,
  joinProvider,
  escapeQuote,
  escapeCss
} = require('mn-utils');
const baseVariance = variance.base;

const __join = joinProvider('*');
const __joinEmpty = joinProvider('');

const regexpDepth = /^(\d+)(.*)$/;
const splitSelector = escapedSplitProvider(/[<:\.\[\]#+~]/).base;
const splitParent = escapedSplitProvider(/<|>\-/).base;
const splitChild = escapedSplitProvider(/>|<\-/).base;
const splitMedia = escapedSplitProvider('@').base;
const splitMultiplier = escapedSplitProvider('*').base;
const splitState = escapedSplitProvider(':').base;
const splitReverse = escapedSplitProvider('!').base;
const regexpScope = /^(.*?)\[(.*)\]$/;
const regexpAttrEscape = /\[([^\]]*)\]/g;
const replacerEscape = (_, v) => '[' + escapeCss(v) + ']';


const selectorsCompileProvider = module.exports = (instance) => {
  const parseId = (comboName) => parseComboName(comboName, '#' + escapeCss(comboName));
  const parseClass = (comboName) => parseComboName(comboName, '.' + escapeCss(comboName));
  const parseAttrProvider = (attrName) => {
    const prefix = '[' + attrName + '~=\'';
    return (comboName) => parseComboName(comboName, prefix + escapeQuote(comboName) + '\']');
  };
  let $$states;
  const $$parsers = {
    id: parseId,
    'class': parseClass
  };
  const parseComboNameProvider = (attrName) => $$parsers[attrName] || ($$parsers[attrName] = parseAttrProvider(attrName));
  const parseComboName = (comboName, targetName) => {
    $$states = instance.states || {};
    const multiplierParts = splitMultiplier(comboName);
    if (multiplierParts.length > 1) {
      const multiplier = parseInt(multiplierParts.pop());
      if (!isNaN(multiplier)) {
        comboName = multiplierParts.join('*');
        if (multiplier > 1) targetName = targetName.repeat(multiplier);
      }
    }
    return reduce(
      reduce(baseVariance(comboName), suffixesReduce, {}),
      (items, essences, suffix) => {
        const mediaNames = [];
        const parts = splitChild(__joinEmpty(splitReverse(suffix).reverse()));
        push(items, {
          essences,
          selectors: reduce(parts, (selectors, partName) => {
            const part = getPart(partName, ' ');
            return joinMaps({}, selectors, getParents(mediaNames, part.name), part.prefix);
          }, getParents(mediaNames, parts.shift(), targetName)),
          mediaName: mediaNames[0] || 'all'
        });
        return items;
      },
      []
    );
  };


  const getMap = (name) => {
    const synonyms = {};
    synonyms[name] = true;
    return synonyms;
  };

  const procMedia = (mediaNames, partName) => {
    const separators = [];
    return __joinEmpty(reduce(splitSelector(partName, separators), (output, selector, index) => {
      const mediaParts = splitMedia(selector);
      push(output, mediaParts[0] + (separators[index] || ''));
      mediaParts.length > 1 && push(mediaNames, mediaParts[1]);
      return output;
    }, []));
  };

  const getParents = (mediaNames, name, targetName) => {
    const parts = splitParent(name);
    const l = parts.length;
    let essence = getEssence(procMedia(mediaNames, parts[0]));
    let alts = joinMaps({}, getMap(((targetName || '') + essence.selector) || (targetName === undefined ? '*' : '')), essence.states);
    for (let part, i = 1; i < l; i++) {
      part = getPart(procMedia(mediaNames, parts[i]), ' ');
      essence = getEssence(part.name);
      alts = joinMaps({}, joinMaps({}, getMap(essence.selector || '*'), essence.states), alts, part.prefix);
    }
    return alts;
  };

  const getStatesMap = (state) => {
    let matchs, suffix = '', v = '', ns, si;
    if (matchs = regexpFix.exec(state)) {
      state = matchs[1];
      suffix = matchs[2];
    }
    const dst = {};
    if (matchs = regexpScope.exec(state)) {
      state = matchs[1];
      if (v = matchs[2] || '') v = '(' + v + ')';
    }
    v += suffix;
    if ((ns = $$states[state]) && (si = ns.length)) {
      for (;si--;) dst[ns[si] + v] = true;
    } else {
      dst[':' + state + v] = true;
    }
    return dst;
  };
  const joinStates = (alts, states) => {
    let length = states.length;
    if (!length) return alts;
    for (let i = 0; i < length; i++) alts = joinMaps({}, alts, getStatesMap(unslash(states[i])));
    return alts;
  };
  const getEssence = (name) => {
    const states = splitState(name.replace(regexpAttrEscape, replacerEscape));
    const selector = unslash(states.shift());
    return {
      selector,
      states: joinStates({'': true}, states)
    };
  };

  return extend(instance || (instance = parseComboName), {
    states: {},
    parseComboName,
    parseComboNameProvider,
    parseAttrProvider,
    parseId,
    parseClass,
    getParents,
    getEssence
  });
};

const extractSuffix = escapedBreakupProvider(/[<>:\.\[\]#+~@\!]/).base;

const getPrefix = (depth) => {
  if (depth < 1) return '';
  let output = [];
  for (;depth--;) push(output, '>');
  return __join(output);
};
const getPart = (name, defPrefix) => {
  const depthMatchs = regexpDepth.exec(name);
  return depthMatchs ? {
    prefix: getPrefix(parseInt(depthMatchs[1])),
    name: depthMatchs[2] || ''
  } : { prefix: defPrefix || '', name };
};
const suffixesReduce = (suffixes, altComboName) => {
  const extract = extractSuffix(altComboName);
  const suffix = extract.suffix;
  (suffixes[suffix] || (suffixes[suffix] = {}))[unslash(extract.prefix)] = true;
  return suffixes;
};
const regexpFix = /^(.*)([~+])$/;
