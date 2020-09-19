const extend = require('mn-utils/extend');
const unslash = require('mn-utils/unslash');
const escapedSplitProvider = require('mn-utils/escapedSplitProvider');
const joinMaps = require('mn-utils/joinMaps');
const escapedHalfProvider = require('mn-utils/escapedHalfProvider');
const variantsBase = require('mn-utils/variants').base;
const reduce = require('mn-utils/reduce');
const push = require('mn-utils/push');
const escapeQuote = require('mn-utils/escapeQuote');
const escapeCss = require('mn-utils/escapeCss');
const repeat = require('mn-utils/repeat');
const scopeJoin = require('mn-utils/scopeJoin');
const scopeSplit = require('mn-utils/scopeSplit');
const selectorNormalize = require('./selectorNormalize');

const splitSelector = escapedSplitProvider(/[<:\.\[\]#+~]/).base;
const splitParent = escapedSplitProvider(/<|>\-/).base;
const splitChild = escapedSplitProvider(/>|<\-/).base;
const splitMedia = escapedSplitProvider('@').base;
const splitState = escapedSplitProvider(':').base;
const extractSuffix = escapedHalfProvider(/[<>:\.\[\]#+~@\!]/).base;
const regexpDepth = /^(\d+)(.*)$/;
const regexpMultiplier = /^(.*)\*([0-9]+)$/;
const regexpScopeSuffix = /^(.*?)([+~])$/;

const SCOPE_START = '[';
const SCOPE_END = ']';

function getScope(value) {
  const matches = regexpScopeSuffix.exec(value);
  const input = scopeSplit(matches ? matches[1] : value, SCOPE_START, SCOPE_END); // eslint-disable-line
  const first = input.shift() || [];
  const scope = first[1];
  return [
    first[0] || '',
    (scope ? ('(' + scopeJoin(scope, SCOPE_START, SCOPE_END) + ')') : '')
      + scopeJoin(input, SCOPE_START, SCOPE_END)
      + (matches ? matches[2] : ''),
  ];
}
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
  function parseComboName(comboName, targetName, multiplierMatch, multiplier) {
    $$states = instance.states || {};
    if (multiplierMatch = regexpMultiplier.exec(comboName)) {
      comboName = multiplierMatch[1];
      (multiplier = parseInt(multiplierMatch[2])) > 1
        && (targetName = repeat(targetName, multiplier));
    }
    return reduce(
        reduce(variantsBase(comboName), suffixesReduce, {}),
        (items, essences, suffix) => {
          const mediaNames = [];
          const parts = splitChild(selectorNormalize(suffix));
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
    return reduce(splitSelector(partName, separators), (output, selector, index) => {
      const mediaParts = splitMedia(selector);
      push(output, mediaParts[0] + (separators[index] || ''));
      mediaParts.length > 1 && push(mediaNames, unslash(mediaParts[1]));
      return output;
    }, []).join('');
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
    const scope = getScope(state);
    const suffix = scope[1];
    state = scope[0];
    let ns, si; // eslint-disable-line
    if ((ns = $$states[state]) && (si = ns.length)) {
      for (;si--;) dst[ns[si] + suffix] = 1;
    } else {
      dst[':' + state + suffix] = 1;
    }
    return dst;
  }

  function joinStates(alts, states) {
    const length = states.length;
    let i = 0;
    // eslint-disable-next-line
    for (; i < length; i++) alts = joinMaps({}, alts, getStatesMap(unslash(states[i])));
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
