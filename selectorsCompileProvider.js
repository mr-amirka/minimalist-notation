const extend = require('mn-utils/extend');
const unslash = require('mn-utils/unslash');
const escapedSplitProvider = require('mn-utils/escapedSplitProvider');
const joinMaps = require('mn-utils/joinMaps');
const escapedHalfProvider = require('mn-utils/escapedHalfProvider');
const variantsBase = require('mn-utils/variants').base;
const reduce = require('mn-utils/reduce');
const push = require('mn-utils/push');
const joinProvider = require('mn-utils/joinProvider');
const escapeQuote = require('mn-utils/escapeQuote');
const escapeCss = require('mn-utils/escapeCss');

const __join = joinProvider('*');
const __joinEmpty = joinProvider('');
const splitSelector = escapedSplitProvider(/[<:\.\[\]#+~]/).base;
const splitParent = escapedSplitProvider(/<|>\-/).base;
const splitChild = escapedSplitProvider(/>|<\-/).base;
const splitMedia = escapedSplitProvider('@').base;
const splitState = escapedSplitProvider(':').base;
const splitReverse = escapedSplitProvider('!').base;
const extractSuffix = escapedHalfProvider(/[<>:\.\[\]#+~@\!]/).base;
const regexpScope = /^(.*?)\[(.*)\]$/;
const regexpAttrEscape = /\[([^\]]*)\]/g;
const regexpDepth = /^(\d+)(.*)$/;
const regexpFix = /^(.*)([~+])$/;
const regexpClassSubstr = /\.\*([A-Za-z0-9-_$]+)/g;
const regexpIdSubstr = /\#\*([A-Za-z0-9-_$]+)/g;
const regexpMultiplier = /^(.*)\*([0-9]+)$/;

function replacerEscape(_, v) {
  return '[' + escapeCss(v) + ']';
}
function getPrefix(depth) {
  if (depth < 1) return '';
  const output = [];
  for (;depth--;) push(output, '>');
  return __join(output);
}
function getPart(name, defPrefix) {
  const depthMatchs = regexpDepth.exec(name);
  return depthMatchs ? {
    prefix: getPrefix(parseInt(depthMatchs[1])),
    name: depthMatchs[2] || '',
  } : {prefix: defPrefix || '', name};
}
function suffixesReduce(suffixes, altComboName) {
  const extract = extractSuffix(altComboName);
  const suffix = extract.suffix;
  (suffixes[suffix] || (suffixes[suffix] = {}))[unslash(extract.prefix)] = true;
  return suffixes;
}

module.exports = (instance) => {
  let $$states;
  const $$parsers = {
    'id': parseId,
    'class': parseClass,
  };
  const parseComboNameProvider = (attrName) => $$parsers[attrName]
    || ($$parsers[attrName] = parseAttrProvider(attrName));

  function parseId(comboName) {
    return parseComboName(comboName, '#' + escapeCss(comboName));
  }
  function parseClass(comboName) {
    return parseComboName(comboName, '.' + escapeCss(comboName));
  }
  function parseAttrProvider(attrName) {
    const prefix = '[' + attrName + '~=\'';
    return (comboName) => parseComboName(
        comboName, prefix + escapeQuote(comboName) + '\']',
    );
  }
  function parseComboName(comboName, targetName) {
    $$states = instance.states || {};
    const multiplierMatch = regexpMultiplier.exec(comboName);
    if (multiplierMatch) {
      comboName = multiplierMatch[1];
      const multiplier = parseInt(multiplierMatch[2]);
      if (multiplier > 1) targetName = targetName.repeat(multiplier);
    }
    return reduce(
        reduce(variantsBase(comboName), suffixesReduce, {}),
        (items, essences, suffix) => {
          const mediaNames = [];
          const parts = splitChild(__joinEmpty(splitReverse(
              suffix
                  .replace(regexpClassSubstr, '[class*=$1]')
                  .replace(regexpIdSubstr, '[id*=$1]'),
          ).reverse()));
          push(items, {
            essences,
            selectors: reduce(parts, (selectors, partName) => {
              const part = getPart(partName, ' ');
              return joinMaps(
                  {},
                  selectors,
                  getParents(mediaNames, part.name),
                  part.prefix,
              );
            }, getParents(mediaNames, parts.shift(), targetName)),
            mediaName: mediaNames[0] || '',
          });
          return items;
        },
        [],
    );
  }
  function getMap(name) {
    const synonyms = {};
    synonyms[name] = true;
    return synonyms;
  }
  function procMedia(mediaNames, partName) {
    const separators = [];
    // eslint-disable-next-line
    return __joinEmpty(reduce(splitSelector(partName, separators), (output, selector, index) => {
      const mediaParts = splitMedia(selector);
      push(output, mediaParts[0] + (separators[index] || ''));
      mediaParts.length > 1 && push(mediaNames, escapeCss(mediaParts[1]));
      return output;
    }, []));
  }
  function getParents(mediaNames, name, targetName) {
    const parts = splitParent(name);
    const l = parts.length;
    let essence = getEssence(procMedia(mediaNames, parts[0]));
    let alts = joinMaps({}, getMap(((targetName || '') + essence.selector)
      || (targetName === undefined ? '*' : '')), essence.states);
    let part, i = 1; // eslint-disable-line
    for (;i < l; i++) {
      part = getPart(procMedia(mediaNames, parts[i]), ' ');
      essence = getEssence(part.name);
      alts = joinMaps({}, joinMaps({},
          getMap(essence.selector || '*'), essence.states), alts, part.prefix);
    }
    return alts;
  }
  function getStatesMap(state) {
    const dst = {};
    let matchs, suffix = '', v = '', ns, si; // eslint-disable-line
    if (matchs = regexpFix.exec(state)) {
      state = matchs[1];
      suffix = matchs[2];
    }
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
  }
  function joinStates(alts, states) {
    const length = states.length;
    let i = 0;
    if (!length) return alts;
    // eslint-disable-next-line
    for (; i < length; i++) alts = joinMaps({}, alts, getStatesMap(unslash(states[i])));
    return alts;
  }
  function getEssence(name) {
    const states = splitState(name.replace(regexpAttrEscape, replacerEscape));
    const selector = unslash(states.shift());
    return {
      selector,
      states: joinStates({'': true}, states),
    };
  }

  return extend(instance || (instance = parseComboName), {
    states: {},
    parseComboName,
    parseComboNameProvider,
    parseAttrProvider,
    parseId,
    parseClass,
    getParents,
    getEssence,
  });
};
