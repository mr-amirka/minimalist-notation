const minimalistNotationProvider = require('./index');
const map = require('mn-utils/map');

module.exports = (options) => {
  const {
    recompileFrom,
    emitter,
  } = minimalistNotationProvider(options);
  const {
    getValue,
  } = emitter;
  return (attrsMap) => {
    recompileFrom(attrsMap);
    return map(getValue(), 'content').join('');
  };
};
