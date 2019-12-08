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

const parser = module.exports = (attrs) => {
  if (isEmpty(attrs = getAttrs(attrs))) return null;

  /*
    desctiption for
    \{? - minifixed for JSX
    example:
      <div m={'rlv st1' + m}>
        ...
      </div>

    (:\\s+((\\\\"([^"]+)\\\\")|("([^"]+)"))) - fixed for dist js
    example:
      React.createElement("div", {m: "abs s ovxHidden ovScroll"}, null)

    (\\\\"([^"]+)\\\\") - fixed for dev dist js
    example:
      eval(" ... React.createElement(\"div\", {
        m: \"abs s ovxHidden ovScroll\"
      }, null) ...")
  */
  const attrNames = '(' + getKeys(attrs).join('|') + ')';
  const regexp = new RegExp('(\\s+|\\{\\s*)' + attrNames
    + '((=\\{?\\s*("([^"]+)"|\'([^\']+)\'|`([^`]+)`))|(:\\s*(\\\\"([^"]+)\\\\"|"([^"]+)"|\'([^\']+)\'|`([^`]+)`)))', 'gm'); // eslint-disable-line
  return (dst, text) => {
    let count = 0;
    text.replace(regexp, (
        all, prefix, attrName, withQuoteValueAll, vvWrap1, vWrap1,
        doubleQuote, oneQuote, apostrophe, vvWrap2, vWrap2,
        escapedDoubleQuoteAsValue,
        doubleQuoteAsValue, oneQuoteAsValue, apostropheAsValue,
    ) => {
      const targetAttrName = attrs[attrName];
      const essencesMap = dst[targetAttrName] || (dst[targetAttrName] = {});
      forEach(
          splitSpace(
              escapedDoubleQuoteAsValue
                ? unslash(escapedDoubleQuoteAsValue)
                : (
                  doubleQuote
                    || oneQuote
                    || apostrophe
                    || doubleQuoteAsValue
                    || oneQuoteAsValue
                    || apostropheAsValue
                ),
          ),
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
};
const getAttrs = parser.getAttrs = (attrs) => {
  isString(attrs) && (attrs = splitAttrs(attrs));
  if (!isObject(attrs)) return null;
  return isArray(attrs) ? reduce(filter(attrs), (output, name) => {
    output[name] = name;
    return output;
  }, {}) : attrs;
};
