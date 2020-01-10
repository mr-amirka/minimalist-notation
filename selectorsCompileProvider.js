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
const repeat = require('mn-utils/repeat');

const joinEmpty = joinProvider('');
const splitSelector = escapedSplitProvider(/[<:\.\[\]#+~]/).base;
const splitParent = escapedSplitProvider(/<|>\-/).base;
const splitChild = escapedSplitProvider(/>|<\-/).base;
const splitMedia = escapedSplitProvider('@').base;
const splitState = escapedSplitProvider(':').base;
const splitReverse = escapedSplitProvider('!').base;
const extractSuffix = escapedHalfProvider(/[<>:\.\[\]#+~@\!]/).base;
const regexpScope = /^(.*?)\[(.*)\]$/;
const regexpDepth = /^(\d+)(.*)$/;
const regexpFix = /^(.*)([~+])$/;
const regexpClassSubstr = /\.\*([A-Za-z0-9-_$]+)/g;
const regexpIdSubstr = /\#\*([A-Za-z0-9-_$]+)/g;
const regexpMultiplier = /^(.*)\*([0-9]+)$/;

function getPrefix(depth) {
  return depth < 1 ? '' : ('>' + repeat('*>', depth - 1));
}
function getPart(name, defPrefix) {
  const depthMatchs = regexpDepth.exec(name);
  return depthMatchs ? [
    getPrefix(parseInt(depthMatchs[1])),
    depthMatchs[2] || '',
  ] : [defPrefix || '', name];
}
function suffixesReduce(suffixes, altComboName) {
  const extract = extractSuffix(altComboName);
  const suffix = extract[1];
  (suffixes[suffix] || (suffixes[suffix] = {}))[unslash(extract[0])] = 1;
  return suffixes;
}

module.exports = (instance) => {
  let $$states;
  const $$parsers = {
    'id': parseId,
    'class': parseClass,
  };
  function parseComboNameProvider(attrName) {
    return $$parsers[attrName]
      || ($$parsers[attrName] = parseAttrProvider(attrName));
  }
  function parseId(comboName) {
    return parseComboName(comboName, '#' + escapeCss(comboName));
  }
  function parseClass(comboName) {
    return parseComboName(comboName, '.' + escapeCss(comboName));
  }
  function parseAttrProvider(attrName) {
    const prefix = '[' + attrName + '~="';
    return (comboName) => parseComboName(
        comboName, prefix + escapeQuote(comboName) + '"]',
    );
  }
  function parseComboName(comboName, targetName) {
    $$states = instance.states || {};
    const multiplierMatch = regexpMultiplier.exec(comboName);
    if (multiplierMatch) {
      comboName = multiplierMatch[1];
      const multiplier = parseInt(multiplierMatch[2]);
      if (multiplier > 1) targetName = repeat(targetName, multiplier);
    }
    return reduce(
        reduce(variantsBase(comboName), suffixesReduce, {}),
        (items, essences, suffix) => {
          const mediaNames = [];
          const parts = splitChild(joinEmpty(splitReverse(
              suffix
                  .replace(regexpClassSubstr, '[class*=$1]')
                  .replace(regexpIdSubstr, '[id*=$1]'),
          ).reverse()));
          return push(items, [
            essences,
            reduce(parts, (selectors, partName) => {
              const part = getPart(partName, ' ');
              return joinMaps(
                  {},
                  selectors,
                  getParents(mediaNames, part[1]),
                  part[0],
              );
            }, getParents(mediaNames, parts.shift(), targetName)),
            mediaNames[0] || '',
          ]);
        },
        [],
    );
  }
  function getMap(name) {
    const synonyms = {};
    synonyms[name] = 1;
    return synonyms;
  }
  function procMedia(mediaNames, partName) {
    const separators = [];
    // eslint-disable-next-line
    return joinEmpty(reduce(splitSelector(partName, separators), (output, selector, index) => {
      const mediaParts = splitMedia(selector);
      push(output, mediaParts[0] + (separators[index] || ''));
      mediaParts.length > 1 && push(mediaNames, unslash(mediaParts[1]));
      return output;
    }, []));
  }
  function getParents(mediaNames, name, targetName) {
    const parts = splitParent(name);
    const l = parts.length;
    let essence = getEssence(procMedia(mediaNames, parts[0]));
    let alts = joinMaps({}, getMap(((targetName || '') + essence[0])
      || (targetName === undefined ? '*' : '')), essence[1]);
    let part, i = 1; // eslint-disable-line
    for (;i < l; i++) {
      part = getPart(procMedia(mediaNames, parts[i]), ' ');
      essence = getEssence(part[1]);
      alts = joinMaps({}, joinMaps({},
          getMap(essence[0] || '*'), essence[1]), alts, part[0]);
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
      v = '(' + (matchs[2] || '') + ')';
    }
    v += suffix;
    if ((ns = $$states[state]) && (si = ns.length)) {
      for (;si--;) dst[ns[si] + v] = 1;
    } else {
      dst[':' + state + v] = 1;
    }
    return dst;
  }
  function joinStates(alts, states) {
    const length = states.length;
    let i = 0;
    if (length) {
      for (; i < length; i++) {
        alts = joinMaps({}, alts, getStatesMap(unslash(states[i])));
      }
    }
    return alts;
  }
  function getEssence(name) {
    const states = splitState(name);
    return [
      unslash(states.shift()),
      joinStates({'': 1}, states),
    ];
  }

  return extend(instance || (instance = parseComboName), {
    states: {},
    parseComboName,
    parseComboNameProvider,
    parseId,
    parseClass,
  });
};
