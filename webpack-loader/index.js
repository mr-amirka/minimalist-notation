const loaderUtils = require('loader-utils');
const extend = require('mn-utils/extend');

const pluginModule = require('../common/pluginProvider')();


const __exports = module.exports = function(source) {
  return pluginModule.sourceHandle({
    source,
    key: this.resourcePath,
    settings: loaderUtils.getOptions(this),
  }).source;
};
extend(__exports, require('../common/defaultPluginSettings'));

__exports.presetsReload = function(source) {
  return pluginModule.sourceHandleOfPresetsReload({
    source,
    key: this.resourcePath,
    settings: loaderUtils.getOptions(this),
  }).source;
};

__exports.MnPlugin = MnPlugin;


function MnPlugin(options) {
  const plugin = pluginModule.plugin(options);

  this.apply = (compiler) => {
    plugin.startTemplateParse(compiler.options);

    function emitCallback(compilation, callback) {
      plugin.startCompile({}).then(callback);
    }

    if (compiler.plugin) {
      compiler.plugin('emit', emitCallback);
      return;
    }

    compiler.hooks.done.tap({
      name: "dts-bundle",
    }, emitCallback);
  };
}
