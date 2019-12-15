# Minimalist Notation CLI


## Install
```sh
npm install -g minimalist-notation
```

## Usage


#### For directory
```sh
mn --compile ./src --output ./dist/styles.css
```


#### For one file
```sh
mn --compile ./index.html --output ./dist/styles.css
```


### Run with configuration
```sh
mn --config ./mn-config.js
```

#### Configuration example

```js
// mn-config.js
module.exports = {
  entry: {
    styles: { // styles.css
      path: './',
      attrs: [
        'class'
      ],
      include: [
        /^.*\.(html?|(js|ts)x?|vue)$/
      ],
      exclude: [
        /\/node_modules\/|(.*\.tmp)/
      ],
      metrics: './mn-metrics.json'
    }
    // other...
  },
  // global options:
  /*
  path: './'
  output: './styles.css',
  */
  attrs: [ 'class' ],
  include: [
    /^.*\.(html?|(js|ts)x?|vue)$/
  ],
  exclude: [
    /\/node_modules\/|(.*\.tmp)/
  ],
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/prefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    // require('mn-presets/main'),
    // require('mn-presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
  ]
};

```

## Interface
```ts
interface compileSourceOptions {
  path: string,
  selectorPrefix?: string,
  entry?: string | {
    [outputName: string]: string | compileSourceOptions
  },
  output?: string | null,
  include?: RegExp | RegExp[],
  exclude?: RegExp | RegExp[],
  attrs?: string | string[] | {[fromName:string]: string},
  presets?: MnPreset[]
}
```


## Default options

| option  | value                             |
| ------- | --------------------------------- |
| config  | './mn-config.js'                  |
| prefix  | ''                                |
| path    | './'                              |
| entry   | './'                              |
| output  | './mn.styles.css'                 |
| metrics | './mn-metrics.json' if true       |
| attrs   | [ 'm' ]                           |
| presets | [  require('mn-presets/medias'), require('mn-presets/prefixes'), require('mn-presets/styles'), require('mn-presets/states'), require('mn-presets/main') ] |

* include: ``` /^.*\.(html?|(js|ts)x?|vue)$/ ```
* exclude: ``` /\/node_modules\/|(\.tmp\.)/  ```
