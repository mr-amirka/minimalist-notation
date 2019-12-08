const minimalistNotationProvider = require('./index');
const isArray = require('mn-utils/isArray');
module.exports = ({presets, ...options} = {}) => {
  const mn = minimalistNotationProvider();
  const {
    setPresets,
    recompileFrom,
    emitter,
  } = mn;
  mn.options = options;
  isArray(presets) && setPresets(presets);
  return (attrsMap) => {
    recompileFrom(attrsMap);
    return emitter.getValue().map(__itemMap).join('');
  };
};
function __itemMap(item) {
  return item.content;
}
