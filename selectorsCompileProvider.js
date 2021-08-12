const isDefined = require('mn-utils/isDefined');
const extend = require('mn-utils/extend');
const unslash = require('mn-utils/unslash');
const escapedSplitProvider = require('mn-utils/escapedSplitProvider');
const escapedHalfProvider = require('mn-utils/escapedHalfProvider');
const joinOnly = require('mn-utils/joinOnly');
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
const regexpScopeSuffix = /^([A-Za-z0-9-_$]+)(.*)$/;
const SCOPE_START = '[';
const SCOPE_END = ']';


function getCombinatorByDepth(depth) {
  return depth < 1 ? '' : ('>' + repeat('*>', depth - 1));
}
function getCombinator(name) {
  const depthMatchs = regexpDepth.exec(name);
  return depthMatchs ? [
    getCombinatorByDepth(parseInt(depthMatchs[1])),
    depthMatchs[2] || '',
  ] : [' ', name];
}
function extractMedia(mediaNames, partName) {
  const separators = [];
  // eslint-disable-next-line
  return partName ? joinOnly(reduce(splitSelector(partName, separators), (output, selector, index) => {
    const mediaParts = splitMedia(selector);
    push(output, mediaParts[0] + (separators[index] || ''));
    mediaParts.length > 1 && push(mediaNames, unslash(mediaParts[1]));
    return output;
  }, [])) : '';
}
function suffixesReduce(suffixes, altComboName) {
  const extract = extractSuffix(altComboName);
  const suffix = selectorNormalize(extract[1]);
  (suffixes[suffix] || (suffixes[suffix] = {}))[unslash(extract[0])] = 1;
  return suffixes;
}

function joinMapsWithFirstValue(prefixes, suffixes, separator) {
  separator = separator || '';
  let output = {}, prefix, suffix, p, value, hasValue; // eslint-disable-line
  for (prefix in prefixes) { // eslint-disable-line
    hasValue = isDefined(value = prefixes[prefix]);
    p = prefix + separator;
    for (suffix in suffixes) { // eslint-disable-line
      output[p + suffix] = hasValue ? value : suffixes[suffix];
    }
  }
  return output;
}

function joinPrefixWithFirstValue(prefix, suffixes, prefixValue) {
  let output = {}, suffix, hasValue = isDefined(prefixValue); // eslint-disable-line
  for (suffix in suffixes) { // eslint-disable-line
    output[prefix + suffix] = hasValue ? prefixValue : suffixes[suffix];
  }
  return output;
}

function joinSuffixWithFirstValue(prefixes, suffix, suffixValue) {
  let output = {}, prefix, value, hasValue; // eslint-disable-line
  for (prefix in prefixes) { // eslint-disable-line
    hasValue = isDefined(value = prefixes[prefix]);
    output[prefix + suffix] = hasValue ? value : suffixValue;
  }
  return output;
}

function provider(instance) {
  let $$states, $$synonyms; // eslint-disable-line
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
  function childsIteratee(alts, childName) {
    const part = getCombinator(childName);
    return joinMapsWithFirstValue(alts, getParents(part[1]), part[0]);
  }
  function parseComboName(comboName, targetName, multiplierMatch, multiplier) {
    $$states = instance.states || {};
    $$synonyms = instance._synonyms || {};
    if (multiplierMatch = regexpMultiplier.exec(comboName)) {
      comboName = multiplierMatch[1];
      (multiplier = parseInt(multiplierMatch[2])) > 1
        && (targetName = repeat(targetName, multiplier));
    }

    // eslint-disable-next-line
    return reduce(reduce(variantsBase(comboName), suffixesReduce, {}), (items, essences, suffix) => {
      const childs = splitChild(suffix);
      const first = getParents(childs.shift(), targetName);
      return push(items, [
        essences,
        reduce(childs, childsIteratee, first),
      ]);
    }, []);
  }

  function getParents(name, targetName) {
    const parts = splitParent(name);
    const l = parts.length;
    let part, i = 1, mediaNames = []; // eslint-disable-line
    let essence = getEssence(extractMedia(mediaNames, parts[0]));
    let alts = joinPrefixWithFirstValue(((targetName || '') + essence[0])
      || (isDefined(targetName) ? '' : '*'), essence[1], mediaNames[0]);

    for (;i < l; i++) {
      part = getCombinator(extractMedia(mediaNames = [], parts[i]));
      essence = getEssence(part[1]);
      alts = joinMapsWithFirstValue(
          joinPrefixWithFirstValue(
              essence[0] || '*',
              essence[1],
              mediaNames[0],
          ),
          alts,
          part[0],
      );
    }
    return alts;
  }

  function getSynonyms(value) {
    // eslint-disable-next-line
    let alts = {'': null};
    base(scopeSplit(value, SCOPE_START, SCOPE_END, '\\'), 1);
    return alts;

    function base(scopes, hasTop) {
      // eslint-disable-next-line
      let scopesL = scopes.length, scopesI = 0, scope, state, _state, states, childs, ns, si, statesL, statesI, head, matches, suffix, synonyms;
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

          if (synonyms = $$synonyms[state]) {
            alts = joinMapsWithFirstValue(alts, synonyms);
          } else {
            // deprecated
            if ((ns = $$states[state]) && (si = ns.length)) {
              synonyms = {};
              for (;si--;) synonyms[ns[si] + suffix] = null;
              alts = joinMapsWithFirstValue(alts, synonyms);
            } else {
              _pushSuffix(':' + _state);
            }
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
      alts = joinSuffixWithFirstValue(alts, suffix);
    }
  }

  function getEssence(name) {
    const i = name.indexOf(':');
    return i < 0
      ? [name, {'': null}]
      : [
        unslash(name.substr(0, i)),
        getSynonyms(name.substr(i)),
      ];
  }

  return extend(instance || (instance = parseComboName), {
    states: {},
    parseComboName,
    parseComboNameProvider,
    parseId,
    parseClass,
  });
}

provider.getCombinatorByDepth = getCombinatorByDepth;
provider.getCombinator = getCombinator;
provider.extractMedia = extractMedia;
module.exports = provider;
