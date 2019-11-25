# minimalist-notation/webpack-loader


This is loader of MinimalistNotation for Webpack.


### Example

```js

const { MnPlugin } = require('minimalist-notation/webpack-loader');


module.exports = {
  /* ... */
  module: {
    rules: [
      { // for hot-reload MN presets (but cached including)
        test: /\/mn-presets\/.*\.js$/,
        use: [
          {
            loader: 'minimalist-notation/webpack-loader/reload'
          }
        ]
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              /* ... */
            }
          },
          { // for parsing jsx files
            loader: 'minimalist-notation/webpack-loader'',
            options: {
              id: 'for-attr', // связывает вывод данных с точкой вывода (выводит данные в файл ./dist/app.css')
              attrs: [ 'm' ], // имя атрибутов, которые будут парситься в jsx файлах
            }
          },
          { // for parsing jsx files
            loader: 'mn-loader',
            options: {
              id: 'for-class', // связывает вывод данных с точкой вывода (выводит данные в файл ./dist/classic.css')
              attrs: [ 'className' ], // имя атрибутов, которые будут парситься в jsx файлах
            }
          }
        ]
      }
  },
  plugins: [
    new MnPlugin({
      id: 'for-attr', // идентификатор точки вывода данных
      attrs: [ 'm' ], // имя атрибутов, которые будут парситься в шаблоне ('./src/index.html')
      output: './dist/app.css',
      template: './src/index.html',
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        require('mn-presets/theme')
      ]
    }),
    new MnPlugin({
      id: 'for-class', // идентификатор точки вывода данных
      attrs: [ 'class' ], // имя атрибутов, которые будут парситься в шаблоне ('./src/indexWithClass.html')
      output: './dist/classic.css',
      template: './src/indexWithClass.html',
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        require('mn-presets/theme')
      ]
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
        test: /\/mn-presets\/.*\.js$/,
        use: [
          {
            loader: 'minimalist-notation/webpack-loader/reload',
            options: {
              id: 'app'
            }
          }
        ]
      },
      //...
    ]
  },
  //...
};

```
```js
// /src/app.js
require('./mn-presets/theme');
```
```js
// ./src/mn-presets/theme.js
module.exports = (mn) => {
  mn({
    fCustom: 'f100'
  });
};
```
Эта возможность добавлена для того, чтобы можно была менять пресеты, не перезапуская для этого всю сборку,
но будьте внимательны так, как пресеты остаются закэшироваными, если их подключение удаляется из кода.  
Это связано с тем, что Webpack не предоставляет удобного API для отслеживания того, какие файлы были отключены от сборки проекта.
