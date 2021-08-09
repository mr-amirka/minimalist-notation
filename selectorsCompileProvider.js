const extend = require('mn-utils/extend');
const unslash = require('mn-utils/unslash');
const escapedSplitProvider = require('mn-utils/escapedSplitProvider');
const escapedHalfProvider = require('mn-utils/escapedHalfProvider');
const joinMaps = require('mn-utils/joinMaps');
const joinPrefix = require('mn-utils/joinPrefixToMap');
const joinSuffix = require('mn-utils/joinSuffixToMap');
const variantsBase = require('mn-utils/variants').base;
const reduce = require('mn-utils/reduce');
const push = require('mn-utils/push');
const escapeQuote = require('mn-utils/escapeQuote');
const escapeCss = require('mn-utils/escapeCss');
const repeat = require('mn-utils/repeat');
const scopeSplit = require('mn-utils/scopeSplit');
const selectorNormalize = require('./selectorNormalize');
const splitParent = escapedSplitProvider(/<|>\-/).base;
const splitChild = escapedSplitProvider(/>|<\-/).base;
const splitMedia = escapedSplitProvider('@').base;
const splitState = escapedSplitProvider(':').base;
const splitSelector
  = escapedSplitProvider(/[<>:\.\[\]#+~]/, /\\.|[\.+]\d/).base;
const extractSuffix
  = escapedHalfProvider(/[<>:\.\[\]#+~@\!]/, /\\.|[\.+]\d/).base;
const regexpDepth = /^(\d+)(.*)$/;
const regexpMultiplier = /^(.*)\*([0-9]+)$/;
const regexpScopeSuffix = /^(.*?)([+~])$/;
const SCOPE_START = '[';
const SCOPE_END = ']';


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
function getMap(name) {
  const synonyms = {};
  synonyms[name] = 1;
  return synonyms;
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

  function procMedia(mediaNames, partName) {
    const separators = [];
    // eslint-disable-next-line
    return partName ? reduce(splitSelector(partName, separators), (output, selector, index) => {
      const mediaParts = splitMedia(selector);
      push(output, mediaParts[0] + (separators[index] || ''));
      mediaParts.length > 1 && push(mediaNames, unslash(mediaParts[1]));
      return output;
    }, []).join('') : '';
  }
  function getParents(mediaNames, name, targetName) {
    const parts = splitParent(name);
    const l = parts.length;
    let essence = getEssence(procMedia(mediaNames, parts[0]));
    let alts = joinPrefix(((targetName || '') + essence[0])
      || (targetName === undefined ? '*' : ''), essence[1]);
    let part, i = 1; // eslint-disable-line
    for (;i < l; i++) {
      part = getPart(procMedia(mediaNames, parts[i]), ' ');
      essence = getEssence(part[1]);
      alts = joinMaps(
          joinPrefix(essence[0] || '*', essence[1]),
          alts,
          part[0],
      );
    }
    return alts;
  }

  function getStates(value) {
    // eslint-disable-next-line
    let alts = getMap('');
    base(scopeSplit(value, SCOPE_START, SCOPE_END, '\\'), 1);
    return alts;

    function base(scopes, hasTop) {
      const scopesL = scopes.length;
      // eslint-disable-next-line
      let scopesI = 0, scope, state, _state, states, childs, ns, si, statesL, statesI, head, matches, dst, suf;
      for (; scopesI < scopesL; scopesI++) {
        scope = scopes[scopesI];
        states = splitState(scope[0]);
        head = states.shift();
        head && _pushSuffix(head);
        statesL = states.length;
        statesI = 0;

        for (; statesI < statesL; statesI++) {
          (matches = regexpScopeSuffix.exec(
              _state = state = unslash(states[statesI]),
          ))
            ? (
              state = matches[1],
              suffix = matches[2]
            )
            : (suffix = '');

          if ((ns = $$states[state]) && (si = ns.length)) {
            dst = {};
            for (;si--;) dst[ns[si] + suffix] = 1;
            alts = joinMaps(alts, dst);
          } else {
            _pushSuffix(':' + _state);
          }
        }

        if (childs = scope[1]) {
          _pushSuffix(hasTop ? '(' : '[');
          base(childs);
          _pushSuffix(hasTop ? ')' : ']');
        }
      }
    }
    function _pushSuffix(suffix) {
      alts = joinSuffix(alts, suffix);
    }
  }

  function getEssence(name) {
    const i = name.indexOf(':');
    return i < 0
      ? [name, {'': 1}]
      : [
        unslash(name.substr(0, i)),
        getStates(name.substr(i)),
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
