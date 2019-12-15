# Usage with Node.js

### Example
```js
const {compileSource} = require('minimalist-notation/node');

compileSource({
  watch: true,
  path: './src',
  entry: {
    './dist/styles': './src',
    './dist/other': './other',
    './dist/market.app': {
       include: [ /^.*?market\.app\/.*\.(html?|jsx?)$/ ],
     },
  },
  exclude: [ /^.*\/node_modules\/.*$/ ],
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/prefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    // require('mn-presets/main'),
    // require('mn-presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
  ],
});

```
