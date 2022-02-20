const extend = require('mn-utils/extend');
const unslash = require('mn-utils/unslash');
const escapedSplitProvider = require('mn-utils/escapedSplitProvider');
const escapedHalfProvider = require('mn-utils/escapedHalfProvider');
const joinOnly = require('mn-utils/joinOnly');
const variantsBase = require('mn-utils/variants').base;
const slice = require('mn-utils/slice');
const forEach = require('mn-utils/forEach');
const reduce = require('mn-utils/reduce');
const map = require('mn-utils/map');
const filter = require('mn-utils/filter');
const push = require('mn-utils/push');
const pushArray = require('mn-utils/pushArray');
const escapeQuote = require('mn-utils/escapeQuote');
const escapeCss = require('mn-utils/escapeCss');
const repeat = require('mn-utils/repeat');
const scopeSplit = require('mn-utils/scopeSplit');
const indexOf = require('mn-utils/indexOf');
const selectorNormalize = require('./selectorNormalize');
const splitParent = escapedSplitProvider(/<|>\-/).base;
const splitChild = escapedSplitProvider(/>|<\-/).base;
const splitMedia = escapedSplitProvider('@').base;
const splitState = escapedSplitProvider(':').base;
const splitComma = escapedSplitProvider(',').base;
const splitSelector
  = escapedSplitProvider(/[<>:\.\[\]#+~]/, /\\.|[\.+]\d/).base;
const extractSuffix
  = escapedHalfProvider(/[<>:\.\[\]#+~@\!]/, /\\.|[\.+]\d/).base;
const regexpDepth = /^(\d+)(.*)$/;
const regexpMultiplier = /^(.*)\*([0-9]+)$/;
const regexpScopeSuffix = /^([A-Za-z0-9-_$]+)(.*)$/;
const SCOPE_START = '[';
const SCOPE_END = ']';


function mediaFilterIteratee(mediaNames) {
  const excludes = [];
  const mainMedia = mediaNames.shift();
  mediaNames = filter(mediaNames, (mediaName) => {
    return mediaName && indexOf(excludes, mediaName) < 0
      ? (push(excludes, mediaName), 1)
      : 0;
  });
  return mainMedia
    ? map(splitComma(mainMedia), (mainMedia) => {
      return pushArray([mainMedia], mediaNames).join('&');
    }).join(',')
    : mediaNames.join('&');
}
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

function joinMapsWithFirstValue(prefixes, suffixes, separator, end) {
  separator = separator || '';
  end = end || '';
  let output = {}, prefix, suffix, p, pv, tmp; // eslint-disable-line
  for (prefix in prefixes) { // eslint-disable-line
    pv = prefixes[prefix];
    p = prefix + separator;
    for (suffix in suffixes) { // eslint-disable-line
      tmp = output[p + suffix + end] = slice(suffixes[suffix]);
      tmp[0] = pv[0] || tmp[0];
      pushArray(tmp, slice(pv, 1));
    }
  }
  return output;
}

function joinPrefixWithFirstValue(prefix, suffixes, pv) {
  let output = {}, suffix, tmp; // eslint-disable-line
  for (suffix in suffixes) { // eslint-disable-line
    tmp = output[prefix + suffix] = slice(suffixes[suffix]);
    tmp[0] = pv || tmp[0];
    // output[prefix + suffix] = [pv, suffixes[suffix]];
    // output[prefix + suffix] = pv || suffixes[suffix];
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
    return joinMapsWithFirstValue(alts, getParents(part[1], 0, '*'), part[0]);
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
      const first = getParents(childs.shift(), targetName, '');
      return push(items, [
        essences,
        map(reduce(childs, childsIteratee, first), mediaFilterIteratee),
      ]);
    }, []);
  }

  function getParents(name, targetName, alt) {
    const parts = splitParent(name), l = parts.length; // eslint-disable-line
    let part, i = 1, mediaNames = []; // eslint-disable-line
    let essence = getEssence(extractMedia(mediaNames, parts[0]));
    let alts = joinPrefixWithFirstValue(((targetName || '') + essence[0])
      || alt, essence[1], mediaNames[0]);
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
    let alts = {'': []};
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
            alts = joinMapsWithFirstValue(alts, synonyms, 0, suffix);
          } else {
            // deprecated
            if ((ns = $$states[state]) && (si = ns.length)) {
              synonyms = {};
              for (;si--;) synonyms[ns[si] + suffix] = [];
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
      let prefixes = alts, prefix; // eslint-disable-line
      alts = {};
      for (prefix in prefixes) { // eslint-disable-line
        alts[prefix + suffix] = prefixes[prefix];
      }
    }
  }

  function getEssence(name) {
    const i = name.indexOf(':');
    return i < 0
      ? [name, {'': []}]
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
