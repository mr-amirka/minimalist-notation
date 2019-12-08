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
//mn-config.js
module.exports = {
  /*
  input: './'
  output: './styles.css',
  */
  entry: {
    styles: {
      input: './',
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
  },
  //global options:
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
  	require('mn-presets/theme')
  ]
};

```

## Interface
```ts
interface compileSourceOptions {
  path: string,
  entry?: string | {
    [outputName: string]: string | compileSourceOptions
  },
  output?: string | undefined | null,
  include?: RegExp | RegExp[],
  exclude?: RegExp | RegExp[],
  attrs: string | string[],
  presets: MnPreset[]
}
```


## Default options

| option  | value                             |
| ------- | --------------------------------- |
| config  | './mn-config.js'                  |
| path    | './'                              |
| entry   | './'                              |
| output  | './mn.styles.css'                 |
| metrics | './mn-metrics.json' if true       |
| attrs   | [ 'm' ]                           |
| presets | [  require('mn-presets/medias'),  require('mn-presets/prefixes'),    require('mn-presets/styles'),     require('mn-presets/states'),     require('mn-presets/theme')   ] |

* include: ``` /^.*\.(html?|(js|ts)x?|vue)$/ ```
* exclude: ``` /\/node_modules\/|(\.tmp\.)/  ```