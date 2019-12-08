const stylesRenderProvider = require('mn-utils/browser/stylesRenderProvider');
const childClass = require('mn-utils/childClass');

module.exports = (env) => {
  const {Frame, FrameContextConsumer, createElement, mn} = env;
  const {on} = mn.emitter;
  const FrameInner = childClass(env.Component, function() {
    let subscription;
    const self = this;
    self.render = () => self.props.children;
    self.componentDidMount = () => {
      subscription || (subscription
        = on(stylesRenderProvider(self.props.document, 'mn.')));
    };
    self.componentWillUnmount = () => {
      if (subscription) {
        subscription();
        subscription = null;
      }
    };
  });
  return (props) => createElement(Frame, props, createElement(
      FrameContextConsumer, null,
      (ctx) => createElement(FrameInner, ctx, props.children),
  ));
};
