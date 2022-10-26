const minimalistNotationProvider = require('./index');
const map = require('mn-utils/map');

module.exports = (options) => {
  const {
    recompileFrom,
    styles$,
  } = minimalistNotationProvider(options);
  const {
    getValue,
  } = styles$;
  return (attrsMap) => {
    recompileFrom(attrsMap);
    return map(getValue(), 'content').join('');
  };
};
