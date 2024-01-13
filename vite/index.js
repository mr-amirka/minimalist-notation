const extend = require('mn-utils/extend');
const withReDelay = require('mn-utils/withReDelay');

const pluginModuleProvider = require('../common/pluginProvider');

const __exports = module.exports = {};

extend(__exports, require('../common/defaultPluginSettings'));


const REGEXP_FILE = /\.((j|t)sx?)$/;
const REGEXP_MODULE_FILE = /\.m\.js$/;


function MnPlugin(options) {
  options = options || {};

  const id = options.id || '';
  const pluginModule = pluginModuleProvider({
    defaultPluginSettings: {
      ...options,
      id,
    },
  });
  const fileRegexp = options.fileRegexp || REGEXP_FILE;
  const moduleFileRegexp = options.fileRegexp || REGEXP_MODULE_FILE;
  
  const sourceHandleSettings = {
    id,
  };

  const plugin = pluginModule.plugin({});

  const compile = withReDelay(() => {
    plugin.startTemplateParse({});
    plugin.startCompile();
  }, 100);


  return {
    name: 'minimalist-notation',

    transform(source, key) {
      if (moduleFileRegexp.test(key)) {
        pluginModule.sourceHandleOfPresetsReload({
          source,
          key,
          settings: sourceHandleSettings,
        });
        
        compile();

        return {
          code: '',
          map: null,
        };
      }

      if (fileRegexp.test(key)) {
        const data = pluginModule.sourceHandle({
          source,
          key,
          settings: sourceHandleSettings,
        });

        compile();
  
        return {
          code: data.source,
          map: null,
        };
      }
      
    },
  }
}


__exports.MnPlugin = MnPlugin;