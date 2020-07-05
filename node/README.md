# Usage with Node.js

### Example
```js
const {compileSource} = require('minimalist-notation/node');

compileSource({
  watch: true,
  path: './src',
  // altColor: 'off' // disable alternate color generation
  entry: {
    './dist/styles': './src',
    './dist/other': './other',
    './dist/market.app': {
       include: [ /^.*?market\.app\/.*\.(html?|jsx?)$/ ],
     },
  },
  exclude: [ /^.*\/node_modules\/.*$/ ],
  presets: [
    require('minimalist-notation/presets/medias'),
    require('minimalist-notation/presets/prefixes'),
    require('minimalist-notation/presets/styles'),
    require('minimalist-notation/presets/states'),
    // require('minimalist-notation/presets/main'),
    // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
  ],
});

```
