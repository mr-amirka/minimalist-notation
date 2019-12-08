/**
 * @overview minimalistNotation reactCreateElementPatch for React
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */
const isArray = require('mn-utils/isArray');
const forEach = require('mn-utils/forEach');
const forIn = require('mn-utils/forIn');

/**
 * patchCreateElement
 * @param {func} createElement
 * @param {array | object} attrs
 * @param {object}  mn
 * @example
 * ```js
 *  React.createElement = patchCreateElement(React.createElement, {
 *    className: 'class',
 *    m: 'm',
 *  }, mn);
 * @return {func}
 * ```
 */
module.exports = function patchCreateElement(createElement, attrs, mn) {
  const {getCompiler, deferCompile} = mn;
  const handlers = {};
  isArray(attrs)
    ? forEach(attrs, (attrName) => {
      handlers[attrName] = getCompiler(attrName);
    })
    : forIn(attrs, (toAttrName, fromAttrName) => {
      handlers[fromAttrName] = getCompiler(toAttrName);
    });

  return function(type, props) {
    if (props) {
      let attrName, v; // eslint-disable-line
      for (attrName in handlers) (v = props[attrName]) && handlers[attrName](v); // eslint-disable-line
      deferCompile();
    }
    return createElement.apply(null, arguments); // eslint-disable-line
  };
};
