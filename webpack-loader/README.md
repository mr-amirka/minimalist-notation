# minimalist-notation/webpack-loader


This is loader of the MinimalistNotation for the Webpack 4.


```sh
npm install minimalist-notation --save-dev
```


### Example

```js

const {MnPlugin} = require('minimalist-notation/webpack-loader');

module.exports = {
  /* ... */
  module: {
    rules: [
      { // for hot-reload MN presets (but cached including)
        test: /\/mn-presets\/.*\.js$/,
        use: [
          {
            loader: 'minimalist-notation/webpack-loader/reload',
          },
        ],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              /* ... */
            },
          },
          { // for parsing jsx files
            loader: 'minimalist-notation/webpack-loader',
            options: {
              id: 'for-attr', // связывает вывод данных с точкой вывода (выводит данные в файл ./dist/app.css')
              attrs: [ 'm' ], // имя атрибутов, которые будут парситься в jsx файлах
            }
          },
          { // for parsing jsx files
            loader: 'minimalist-notation/webpack-loader',
            options: {
              id: 'for-class', // связывает вывод данных с точкой вывода (выводит данные в файл ./dist/classic.css')
              attrs: {className: 'class'}, // имя атрибутов, которые будут парситься в jsx файлах
            }
          }
        ]
      }
  },
  plugins: [
    new MnPlugin({
      id: 'for-attr', // идентификатор точки вывода данных
      attrs: [ 'm' ], // имена атрибутов, которые будут парситься в шаблоне ('./src/index.html')
      output: './dist/app.css',
      template: './src/index.html',
      // altColor: 'off', // отключить генерацию альтернативного цвета
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        // require('mn-presets/main'),
        // require('mn-presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom preset
      ],
    }),
    new MnPlugin({
      id: 'for-class', // идентификатор точки вывода данных
      attrs: [ 'class' ], // имена атрибутов, которые будут парситься в шаблоне ('./src/indexWithClass.html')
      output: './dist/classic.css',
      template: './src/indexWithClass.html',
      // altColor: 'off', // отключить генерацию альтернативного цвета
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        // require('mn-presets/main'),
        // require('mn-presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom preset
      ],
    }),
    /* ... */
  ],
  /* ... */
};

```
