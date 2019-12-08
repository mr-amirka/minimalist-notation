const minimalistNotationProvider = require('./index');
const isArray = require('mn-utils/isArray');
const map = require('mn-utils/map');
module.exports = (options) => {
  const {recompileFrom, emitter} = minimalistNotationProvider(options);
  return (attrsMap) => {
    recompileFrom(attrsMap);
    return map(emitter.getValue(), 'content').join('');
  };
};
