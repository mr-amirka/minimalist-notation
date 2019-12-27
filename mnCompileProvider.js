const minimalistNotationProvider = require('./index');
const map = require('mn-utils/map');

module.exports = (options) => {
  const {recompileFrom, emitter} = minimalistNotationProvider(options);
  return (attrsMap) => {
    recompileFrom(attrsMap);
    return map(emitter.getValue(), 'content').join('');
  };
};
