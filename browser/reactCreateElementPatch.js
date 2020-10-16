/**
 * @overview minimalistNotation reactCreateElementPatch for React
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const isArray = require('mn-utils/isArray');
const forEach = require('mn-utils/forEach');
const forIn = require('mn-utils/forIn');

/**
 * patchCreateElement
 * @param {func} createElement
 * @param {array | object} attrs
 * @param {object}  mn
 * @param {boolean} hasDefer?
 * @example
 * ```js
 *  React.createElement = patchCreateElement(React.createElement, {
 *    className: 'class',
 *    m: 'm',
 *  }, mn);
 * @return {func}
 * ```
 */
module.exports = function patchCreateElement(
    createElement, attrs, mn, hasDefer,
) {
  const {getCompiler} = mn;
  const compile = hasDefer ? mn.deferCompile : mn.compile;
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
      compile();
    }
    return createElement.apply(this, arguments); // eslint-disable-line
  };
};
