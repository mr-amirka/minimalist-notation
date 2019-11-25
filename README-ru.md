[English](https://github.com/mr-amirka/minimalist-notation/blob/master/README.md)


# Minimalist Notation

Это лучший CSS фреймворк и препроцессинговая технология, с которой Вы не сможете расстаться.  

Minimalist Notation (MN) (минималистическая нотация) - это технология генерации стилей, основанная на парсинге разметки. Генерация осуществляется непосредственно в СSS. Технология колоссально ускоряет процесс верстки и может использоваться дополнительно с традиционными технологиями, либо заменять их полностью.  

### Example

Input:

```html
<div class="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</div>
```

Output:

```css
@media mediaName{
  .c0F0\@mediaName{color:rgb(0,255,0)}
}
.f12{font-size:12px}
.f14\:h:hover{font-size:14px}
.parent .cF00\<\.parent{color:rgb(255,0,0)}
.bg0F0{background:rgb(0,255,0)}
.sq40{width:40px;height:40px}
.p10{padding:10px}
.mb10{margin-bottom:10px}

```

* [CLI](#cli)  
* [Usage with Webpack](#usage-with-webpack)   
* [Usage with Node.js](#usage-with-nodejs)   
* [Runtime](#runtime)  
    * [Standalone](#standalone)  


* [Подробная документация](https://github.com/mr-amirka/minimalist-notation/blob/master/docs-ru.md)  
* [Предустановленные опции](https://github.com/mr-amirka/mn-presets/blob/master/README.md)  
* [От автора](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author-ru.md)  



Try this tests:
* https://jsfiddle.net/dzgj2sL3/
* https://jsfiddle.net/j6d8aozy/46/  


Home page: http://minimalist-notation.org  


The starter build with Webpack: https://github.com/mr-amirka/mn-get-started  



Буду благодарен за Ваши отзывы и замечания. Пишите мне в [telegram](https://t.me/mr_amirka).    
С любовью, Ваш mr.Amirka :)  


Вы заинтересованы в развитии проекта? Внесите свою [лепту](https://yasobe.ru/na/notation).  



### CLI
```sh
npm install -g mn-cli
```

```sh
mn --compile ./src --output ./dist/styles.css
```

[More about CLI](https://github.com/mr-amirka/mn-cli)



### Usage with Webpack

```sh
npm install mn-loader --save-dev
```


```js
const { MnPlugin } = require('minimalist-notation/webpack-loader');

module.exports = {
  /* ... */
  module: {
    rules: [
      { // for hot-reload MN presets (but cached including)
        test: /\.mn\.js$/,
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
          {
            loader: 'minimalist-notation/webpack-loader',
            options: {
              id: 'app',
              attrs: [ 'm' ]
            }
          }
        ]
      }
  },
  plugins: [
    new MnPlugin({
      id: 'app',
      attrs: [ 'm' ],
      output: './dist/app.css',
      template: './src/index.html',
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        require('mn-presets/theme'),
        require('./theme'),
      ]
    }),
    /* ... */
  ],
  /* ... */
};
```


## Other

## Runtime

```js
const mn = require("minimalist-notation/browser")
  .setPresets([
    require('mn-presets/medias'),
    require('mn-presets/runtimePrefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    require('mn-presets/theme')
  ]);
require('mn-utils/browser/ready')(() => {
  mn.getCompiler('m').recursiveCheck(document)
  mn.compile();

  console.log('minimalistNotation', mn.data);
});
```


### Standalone


```html
<script src="https://dartline.ru/assets/last-standalone-mn.js" async></script>
```
