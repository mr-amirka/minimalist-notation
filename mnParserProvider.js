const isArray = require('mn-utils/isArray');
const isObject = require('mn-utils/isObject');
const isString = require('mn-utils/isString');
const unslash = require('mn-utils/unslash');
const reduce = require('mn-utils/reduce');
const forEach = require('mn-utils/forEach');
const filter = require('mn-utils/filter');
const isEmpty = require('mn-utils/isEmpty');
const getKeys = require('mn-utils/keys');
const splitProvider = require('mn-utils/splitProvider');

const splitSpace = splitProvider(/\s+/);
const splitAttrs = splitProvider(/[\s|,;]+/);
const splitKeyValue = splitProvider(':');

function parser(attrs) {
  if (isEmpty(attrs = getAttrs(attrs))) return null;

  const originAttrNames = '(' + getKeys(attrs).join('|') + ')';

  const attrNames = '(' + [
    originAttrNames,
    '\'' + originAttrNames + '\'',
    '"' + originAttrNames + '"',
    '\\"' + originAttrNames + '\\"',
    '\\\\\\"' + originAttrNames + '\\\\\\"',
  ].join('|') + ')';

  const attrValue = '(' + [
    '\'([^\']+)\'',
    '`([^`]+)`',
    '"([^"]+)"',
    '\\"([^"]+)\\"',
    '\\\\\\"([^"]+)\\\\\\"',
  ].join('|') + ')';

  const attrPrefix = '(' + [
    '\\{\\s*',
    '\\.\\s*',
    '\\s+',
  ].join('|') + ')';


  const regexpValue = attrPrefix + attrNames + '\\s*[\\:=]\\s*' + attrValue;
  const regexp = new RegExp(regexpValue, 'gm');

  return (dst, text) => {
    let count = 0;
    text.replace(regexp, (
      all, prefix,
      wrappedName, nameQ1, nameQ2, nameQ3, nameQ4, nameQ5,
      wrappedValue, valueQ1, valueQ2, valueQ3, valueQ4, valueQ5,
    ) => {
      const attrName = nameQ1 || nameQ2 || nameQ3 || unslash(nameQ4 || '') || unslash(unslash(nameQ5 || ''));
      const attrValue = valueQ1 || valueQ2 || valueQ3 || unslash(valueQ4 || '') || unslash(unslash(valueQ5 || ''));
      const targetAttrName = attrs[attrName];
      const essencesMap = dst[targetAttrName] || (dst[targetAttrName] = {});

      forEach(
        splitSpace(attrValue),
        (name) => {
          count++;
          (essencesMap[name] || (essencesMap[name] = {
            name,
            count: 0,
          })).count++;
        },
      );
    });
    return count;
  };
}
function getAttrs(attrs) {
  isString(attrs) && (attrs = splitAttrs(attrs));
  return isObject(attrs)
    ? filter(isArray(attrs) ? reduce(attrs, (output, name) => {
      if (name) {
        const parts = splitKeyValue(name);
        name = parts[0];
        output[name] = parts[1] || name;
      }
      return output;
    }, {}) : attrs, (v) => v && isString(v))
    : null;
}

parser.getAttrs = getAttrs;

module.exports = parser;
