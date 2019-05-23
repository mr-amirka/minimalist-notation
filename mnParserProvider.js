const isArray = require("mn-utils/isArray");
const isString = require("mn-utils/isString");
const unslash = require("mn-utils/unslash");

module.exports = (attrs) => {
  attrs = getAttrs(attrs);
  if (!attrs) return null;
  // const regexp = /m=\{?("([^"]+)"|'([^']+)')/gm;
  /*
    \{? - minifixed for JSX
    example:
      <div m={'rlv st1' + m}>
        ...
      </div>
  */

  /*
    (:\\s+((\\\\"([^"]+)\\\\")|("([^"]+)"))) - fixed for dist js
    example:
      _.dom("div\, {m: "abs s ovxHidden ovScroll", null})
  */

  /*
    (\\\\"([^"]+)\\\\") - fixed for dev dist js
    example:
      eval(" ... _.dom(\"div\", {\n    m: \"abs s ovxHidden ovScroll\"\n  }, null) ...")
  */
  const attrName = '(' + attrs.join('|') + ')';
  const regexp = new RegExp('(\\s+|\\{)' + attrName + '((=\\{?("([^"]+)"|\'([^\']+)\'))|(:\\s*(\\\\"([^"]+)\\\\"|"([^"]+)")))', 'gm');
  return (dst, text) => {
    let count = 0;
    text.replace(regexp, (all, prefix, attrName, withQuoteValueAll, vvWrap1, vWrap1, v1, v2, vvWrap2, vWrap2, v3, v4) => {
      const essencesMap = dst[attrName] || (dst[attrName] = {});
      (v3 ? unslash(v3) : (v1 || v2 || v4)).split(regexpSpace).forEach((name) => {
        count++;
        (essencesMap[name] || (essencesMap[name] = {
          name,
          count: 0
        })).count++;
      });
    });
    return count;
  };
};
const regexpSpace = /\s+/;
const regexpAttrsSplit = /[\s|,]+/;
const __attrFilter = v => v;
const getAttrs = module.exports.getAttrs = (attrs) => {
  if (!attrs) return null;
  isString(attrs) && (attrs = attrs.split(regexpAttrsSplit));
  if (!isArray(attrs)) return null;
  attrs = attrs.filter(__attrFilter);
  if (attrs.length < 1) return null;
  return attrs;
};
