/**
 * @overview minimalistNotation reactFrameProvider for React
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 */
const stylesRenderProvider = require('mn-utils/stylesRenderProvider');
const extend = require('mn-utils/extend');
const invoke = require('mn-utils/invoke');

/**
 * reactFrameProvider
 * @param {object}  env
 * @example
 * ```js
 *  const mn = require('../../minimalist-notation');
 *  const {Component, createElement} = require('react');
 *  const Frame = require('mn-utils/browser/frameProvider')({
 *    createElement,
 *    Component,
 *    createPortal: require('react-dom').createPortal,
 *  });
 *
 *  const FrameMn = require('minimalist-notation/browser/reactFrameProvider')({
 *    Component,
 *    Frame,
 *    createElement,
 *    mn,
 *  });
 *
 *  function Widget() {
 *    return (
 *      <FrameMn
 *        onMount={(win, doc, headNode, bodyNode) => {
 *          // any initialization code ...
 *          return () => {
 *            // any destroy code ...
 *          };
 *        }}
 *        render={(win, doc, headNode, bodyNode) => {
 *          return (
 *            <div className="sq100">
 *              iFrame Widget
 *            </div>
 *          );
 *        }}
 *      />
 *    );
 *  }
 * @return {func}
 * ```
 */

module.exports = (env) => {
  const {createElement, mn, Frame} = env;
  const {on, getValue} = mn.emitter;
  return (props) => createElement(Frame, extend(extend({}, props), {
    onMount: function(win, doc) {
      const stylesRender = stylesRenderProvider(doc, 'mn.');
      const unsubscribe = on(stylesRender);

      stylesRender(getValue());

      // eslint-disable-next-line
      const unmountHandle = invoke(props, 'onMount', arguments);
      return unmountHandle ? () => {
        unsubscribe();
        unmountHandle();
      } : unsubscribe;
    },
  }));
};
