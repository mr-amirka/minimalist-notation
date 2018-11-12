const minimalistNotationProvider = require("./index");
const isArray = require("mn-utils/is-array");
module.exports = ({ presets, ...options } = {}) => {
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
const __itemMap = item => item.content;
