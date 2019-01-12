const isArray = require("mn-utils/is-array");
const isString = require("mn-utils/is-string");

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
  const attrName = '(' + attrs.join('|') + ')';
  const regexp = new RegExp('\\s+' + attrName + '=\{?("([^"]+)"|\'([^\']+)\')', 'gm');
  return (dst, text) => {
    let count = 0;
    text.replace(regexp, (all, attrName, vWrap, v1, v2) => {
      const essencesMap = dst[attrName] || (dst[attrName] = {});
      (v1 || v2).split(regexpSpace).forEach((name) => {
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
