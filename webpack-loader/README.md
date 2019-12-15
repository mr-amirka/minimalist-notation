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

# Features

For version 0.4:
- добавлена горячая перезагрузка изменяемых MN пресетов, например:
```js
// ./webpack.config.js
module.exports = {
  watch: true,
  //...
  module: {
    rules: [
      {
        test: /\.mn\.js$/,
        use: [
          {
            loader: 'minimalist-notation/webpack-loader/reload',
            options: {
              id: 'app',
            },
          },
        ],
      },
      //...
    ]
  },
  //...
};

```
```js
// /src/app.js
require('./style.mn.js');
```
```js
// ./src/style.mn.js
module.exports = (mn) => {
  mn({
    fCustom: 'f100',
  });
};
```
Эта возможность добавлена для того, чтобы можно была менять пресеты, не перезапуская для этого всю сборку,
но будьте внимательны так, как пресеты остаются закэшированными, если их подключение удаляется из кода.  
Это связано с тем, что Webpack не предоставляет удобного API для отслеживания того, какие файлы были отключены от сборки проекта.
