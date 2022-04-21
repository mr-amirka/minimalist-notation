# Minimalist Notation

This is the best CSS framework and CSS-preprocessing technology that you will not be able to part with.  


Minimalist Notation (MN) is a technology for generating styles based on parsing the markup.
In the current version for web applications, the generation is done directly in the CSS.
Technology tremendously speeds up the layout process and can be used additionally with traditional technologies, or replace completely those.


The advantage over the traditional technologies of CSS-preprocessing is that the developer gets rid of the need to write CSS. CSS is generated automatically based on the notation and the style generate rules specified by the developer.
The developer no longer needs to control which styles are used in his markup and which ones are not, for from now on the styles are generated dynamically only for what is present in the markup.


### Example 1

Input:

```html
<div class="ParentA">
  <div
    class="f12 p10 mb10 f14:h cF00<.ParentA c0F0@mediaName sq40 bg0F0 bg7F7.active"
  >...</div>
</div>
```

Output:

```css
.p10 {
  padding: 10px;
}
.ParentA .cF00\<\.ParentA {
  color: #f00;
}
.sq40 {
  width: 40px;
  height: 40px;
}
.bg0F0 {
  background: #0f0;
}
.bg7F7\.active.active {
  background: #7f7;
}
.f12 {
  font-size: 12px;
}
.mb10 {
  margin-bottom: 10px;
}
@media mediaName {
  .c0F0\@mediaName {
    color: #0f0;
  }
}
@media (pointer: fine) and (hover: hover) {
  .f14\:h:hover {
    font-size: 14px;
  }
}
```


### Example 2

Input:

```html
<div class="ParentA w1/3 rlv h100vh mh5%+10">
  <div class="ParentB abs s ovyS">
    <div
      class="(c0F0|tdU):h@768-1024&mobile,-320 (sq50|bgF00.5)@d"
    >...</div>
    <div class="fw6<.ParentA<.ParentB>.Child1 fw7>.Child1">
      <div class="Child1">...</div>
    </div>
  </div>
</div>
```

Output:

```css
.rlv {
  position: relative;
}
.abs {
  position: absolute;
}
.s {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.ovyS {
  -webkit-overflow-scrolling: touch;
}
.ovyS {
  overflow-y: scroll;
}
.w1\/3 {
  width: 33.33%;
}
.h100vh {
  height: 100vh;
}
.ParentB .ParentA .fw6\<\.ParentA\<\.ParentB\>\.Child1 .Child1 {
  font-weight: 600;
}
.fw7\>\.Child1 .Child1 {
  font-weight: 700;
}
.mh5\%\+10 {
  margin-left: calc(5% + 10px);
  margin-right: calc(5% + 10px);
}
@media (min-width: 768px) and (max-width: 1024px) and (pointer: fine) and (hover: hover) {
  .mobile .\(c0F0\|tdU\)\:h\@768-1024\&mobile\,-320:hover {
    color: #0f0;
  }
  .mobile .\(c0F0\|tdU\)\:h\@768-1024\&mobile\,-320:hover {
    text-decoration: underline;
  }
}
@media (max-width: 320px) and (pointer: fine) and (hover: hover) {
  .\(c0F0\|tdU\)\:h\@768-1024\&mobile\,-320:hover {
    color: #0f0;
  }
  .\(c0F0\|tdU\)\:h\@768-1024\&mobile\,-320:hover {
    text-decoration: underline;
  }
}
@media (min-width: 992px) {
  .\(sq50\|bgF00\.5\)\@d {
    width: 50px;
    height: 50px;
  }
  .\(sq50\|bgF00\.5\)\@d {
    background: rgba(255,0,0,.5);
  }
}
```



* [CLI](#cli)  
* [Usage with Webpack](#usage-with-webpack)    
* [Usage with Gulp3](#usage-with-gulp3)   
* [Runtime](#runtime)  
    * [Standalone](#standalone)  
    * [Integrating "Minimalist Notation" into  React](#integrating-minimalist-notation-into-react)

* [More documentation](https://github.com/mr-amirka/minimalist-notation/blob/master/docs.md)  
* [Presets](https://github.com/mr-amirka/minimalist-notation/blob/master/presets/README.md)  
* [From author](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author.md)  



Try this tests:
* https://jsfiddle.net/Amirka/p15dzucn/  
* https://jsfiddle.net/Amirka/v2rLq7j1/  


Try check how this work with using MN Viewer:  
https://viewer.minimalist-notation.org/  


See default styles docs (minimalist-notation/presets/styles):  
https://styles.minimalist-notation.org/



The starter build with Webpack: https://github.com/mr-amirka/mn-get-started  


-------------------------

### CLI
```sh
npm install -g minimalist-notation
```

```sh
mn --compile ./src --output ./dist/styles.css --watch
```

or
```sh
mn --config ./mn-config.js --watch
```

[More about CLI](https://github.com/mr-amirka/minimalist-notation/blob/master/cli/README.md)


-------------------------

### Usage with Webpack

```sh
npm install minimalist-notation --save-dev
```

Example:
```js
const {
  MnPlugin,
} = require('minimalist-notation/webpack-loader');

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
                // 'm-n': 'm-n',
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
        // 'm-n': 'm-n',
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
        require('minimalist-notation/presets/prefixes'),
        require('minimalist-notation/presets/styles'),
        require('minimalist-notation/presets/medias'),
        require('minimalist-notation/presets/synonyms'),
        // require('minimalist-notation/presets/main'),
        // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom handlers
      ]
    }),
    /* ... */
  ],
  /* ... */
};
```

-------------------------

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
        require('minimalist-notation/presets/prefixes'),
        require('minimalist-notation/presets/styles'),
        require('minimalist-notation/presets/medias'),
        require('minimalist-notation/presets/synonyms'),
        // require('minimalist-notation/presets/main'),
        // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom handlers
      ],
    }))
    .pipe(gulp.dest('./dest/'))
});
```

[More about Gulp3](https://github.com/mr-amirka/minimalist-notation/blob/master/gulp3/README.md)


-------------------------

## Runtime

Example:
```js
const mnProvider = require('minimalist-notation');
const mn = mnProvider({
  // selectorPrefix: '',
  presets: [
    require('minimalist-notation/presets/runtimePrefixes'),
    require('minimalist-notation/presets/styles'),
    require('minimalist-notation/presets/medias'),
    require('minimalist-notation/presets/synonyms'),
    // require('minimalist-notation/presets/main'),
    // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom handlers
    ...(window.mnPresets || []),
  ],
});
const onDocumentReady = require('mn-utils/browser/ready');
const stylesRenderProvider = require('mn-utils/stylesRenderProvider');
const styleTagIdPrefix = 'mn.';
const stylesRender = stylesRenderProvider(document, styleTagIdPrefix);

mn.emitter.on(stylesRender);

onDocumentReady(() => {
  mn.getCompiler('class').recursiveCheck(document);
  // mn.getCompiler('m-n').recursiveCheck(document);
  // mn.getCompiler('m').recursiveCheck(document);
  mn.compile();

  console.log('Minimalist Notation:', mn.data);
});
```

-------------------------

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
<script src="https://minimalist-notation.org/dest/standalone-mn.1.11.0.js" async></script>
```

-------------------------

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
    require('minimalist-notation/presets/runtimePrefixes'),
    require('minimalist-notation/presets/styles'),
    require('minimalist-notation/presets/medias'),
    require('minimalist-notation/presets/synonyms'),

    // require('minimalist-notation/presets/main'),
    // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom handlers
    ...(window.mnPresets || []),
  ],
});
const stylesRenderProvider = require('mn-utils/stylesRenderProvider');
const styleTagIdPrefix = 'mn.';
const stylesRender = stylesRenderProvider(document, styleTagIdPrefix);

mn.emitter.on(stylesRender);

React.createElement = reactCreateElementPatch(React.createElement, {
  className: 'class',
}, mn);


function App() {
  return (
    <div className="tbl c0F0 bg0 w h100vh tc f40">
      <div>
        <div>Hello React!</div>
        <div className="sq10 bgF"></div>
      </div>
    </div>
  );
}

render(<App/>, document.getElementById('app'));

```

-------------------------


I would be grateful for your feedback and comments. Write me in a [telegram](https://t.me/mr_amirka).  
With respect, mr. Amirka 🙂
