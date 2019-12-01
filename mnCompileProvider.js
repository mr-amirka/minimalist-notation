const minimalistNotationProvider = require('./index');
const isArray = require('mn-utils/isArray');
module.exports = ({presets, ...options} = {}) => {
  const {
    setPresets,
    recompileFrom,
    emitter,
  } = minimalistNotationProvider();
  isArray(presets) && setPresets(presets);
  return (attrsMap) => {
    recompileFrom(attrsMap, options);
    return emitter.getValue().map(__itemMap).join('');
  };
};
function __itemMap(item) {
  return item.content;
}
