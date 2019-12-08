# Usage with Node.js

```js
const { compileSource } = require('minimalist-notation/node');

compileSource({
  watch: true,
  path: './src',
  entry: {
    './dist/styles': './src',
    './dist/other': './other',
    './dist/market.app': {
       include: [ /^.*?market\.app\/.*\.(html?|jsx?)$/ ]
     }
  },
  exclude: [ /^.*\/node_modules\/.*$/ ],
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/prefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    require('mn-presets/theme')
  ]
});

```