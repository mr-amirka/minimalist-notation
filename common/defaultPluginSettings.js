
module.exports = {
  defaultPluginSettings: {
    path: './',
    include: [
      /^.*\.(php|html?)$/,
    ],
    exclude: [
      /\/node_modules\/|(.*\.tmp)/,
    ],
    output: './dist/app.css',
    attrs: {
      'className': 'class',
      'class': 'class',
      'm-n': 'm-n',
      'm': 'm',
    },
    presets: [
      require('../presets/prefixes'),
      require('../presets/styles'),
      require('../presets/medias'),
      require('../presets/synonyms'),
    ],
    onError(e) {
      console.error(e);
    },
  },
  defaultLoaderSettings: {
    attrs: {
      'className': 'class',
      'class': 'class',
      'm-n': 'm-n',
      'm': 'm',
    },
  },
};