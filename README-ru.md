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
* [Usage with Gulp3](#usage-with-gulp3)    
* [Runtime](#runtime)  
    * [Standalone](#standalone)  
    * [Integrating "Minimalist Notation" into  React](#integrating-minimalist-notation-into-react)



* [Подробная документация](https://github.com/mr-amirka/minimalist-notation/blob/master/docs-ru.md)  
* [Предустановленные опции](https://github.com/mr-amirka/mn-presets/blob/master/README.md)  
* [От автора](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author-ru.md)  



Try this tests:
* https://jsfiddle.net/qu12sdox/  
* https://jsfiddle.net/pvLx62nh/  


Try check how this work with using MN Viewer:  
http://viewer.minimalist-notation.org/  


The starter build with Webpack: https://github.com/mr-amirka/mn-get-started  



### CLI
```sh
npm install -g minimalist-notation
```

```sh
mn --compile ./src --output ./dist/styles.css
```

[More about CLI](https://github.com/mr-amirka/minimalist-notation/blob/master/cli/README.md)


### Usage with Webpack

```sh
npm install minimalist-notation --save-dev
```

Example:
```js
const {MnPlugin} = require('minimalist-notation/webpack-loader');

module.exports = {
  /* ... */
  module: {
    rules: [
      {
        /*
         * To hot reload the presets.
         * Connects only to the loader.
         * These does not get into the bundle file.
         *
         * Attention!
         * May be there is a bug when deleting a files,
         * because the files are cached,
         * and the file deletion event is not catching.
         */
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
              attrs: { // for jsx parsing
                className: 'class',
                // m: 'm',
              },
            }
          }
        ]
      }
  },
  plugins: [
    new MnPlugin({
      id: 'app',
      attrs: { // for templates (html) parsing
        'class': 'class',
        // m: 'm',
      },
      output: [
        './dist/app.css',
        './public/app.css',
      ],
      template: [
        './src/index.html',
        // './src/other.html',
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
    }),
    /* ... */
  ],
  /* ... */
};
```


### Usage with Gulp3

```sh
npm install minimalist-notation --save-dev
```

Example:
```js
const gulp = require('gulp');
const gulpMN = require('minimalist-notation/gulp3');

gulp.task('build', function() {
  return gulp.src('./src/**/*.html')
    .pipe(gulpMN('./dest/app.css', {
      // selectorPrefix: '',
      // attrs: {'class': 'class'},
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        // require('mn-presets/main'),
        // require('mn-presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom preset
      ],
    }))
    .pipe(gulp.dest('./dest/'))
});
```

[More about Gulp3](https://github.com/mr-amirka/minimalist-notation/blob/master/gulp3/README.md)


## Runtime

Example:
```js
const mnProvider = require('minimalist-notation');
const mn = mnProvider({
  // selectorPrefix: '',
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/runtimePrefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    // require('mn-presets/main'),
    // require('mn-presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
  ],
});
const onDocumentReady = require('mn-utils/browser/ready');
const stylesRenderProvider = require('mn-utils/browser/stylesRenderProvider');
const styleTagIdPrefix = 'mn.';
const stylesRender = stylesRenderProvider(document, styleTagIdPrefix);

mn.emitter.on(stylesRender);

onDocumentReady(() => {
  mn.getCompiler('class').recursiveCheck(document);
  mn.getCompiler('m').recursiveCheck(document);
  mn.compile();

  console.log('Minimalist Notation:', mn.data);
});
```


### Standalone

Example:
```html
<script>
  (window.mnPresets || (window.mnPresets = [])).push(function(mn) {
    mn({
      fCustom: 'f50',
      fCustomBig: 'f100'
    });
  })
</script>
<script src="https://minimalist-notation.org/dest/standalone-mn.1.4.47.js" async></script>
```


### Integrating "Minimalist Notation" into  React

Example:

```js
const React = require('react');
const {render} = require('react-dom');

const reactCreateElementPatch = require('minimalist-notation/browser/reactCreateElementPatch');
const mnProvider = require('minimalist-notation');
const mn = mnProvider({
  // selectorPrefix: '.mn-scope ',
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/runtimePrefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    // require('mn-presets/main'),
    // require('mn-presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
    ...(window.mnPresets || []),
  ],
});
const stylesRenderProvider = require('mn-utils/browser/stylesRenderProvider');
const styleTagIdPrefix = 'mn.';
const stylesRender = stylesRenderProvider(document, styleTagIdPrefix);

mn.emitter.on(stylesRender);

React.createElement = reactCreateElementPatch(React.createElement, {
  className: 'class',
}, mn);


class App extends React.Component {
  render() {
    return (
      <div className="tbl c0F0 bg0 w h100vh tc f40">
        <div>
          <div>Hello React!</div>
          <div className="sq10 bgF"></div>
        </div>
      </div>
    );
  }
}

render(<App/>, document.querySelector('#app'));

```


Буду благодарен за Ваши отзывы и замечания. Пишите мне в [telegram](https://t.me/mr_amirka).    
С любовью, Ваш mr.Amirka :)  


Вы заинтересованы в развитии проекта? Внесите свою [лепту](https://yasobe.ru/na/notation).  
