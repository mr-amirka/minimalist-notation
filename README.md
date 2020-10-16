# Minimalist Notation

This is the best CSS framework and CSS-preprocessing technology that you will not be able to part with.  


Minimalist Notation (MN) is a technology for generating styles based on parsing the markup.
In the current version for web applications, the generation is done directly in the CSS.
Technology tremendously speeds up the layout process and can be used additionally with traditional technologies, or replace completely those.


The advantage over the traditional technologies of CSS-preprocessing is that the developer gets rid of the need to write CSS. CSS is generated automatically based on the notation and the style generate rules specified by the developer.
The developer no longer needs to control which styles are used in his markup and which ones are not, for from now on the styles are generated dynamically only for what is present in the markup.


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

* [More documentation](https://github.com/mr-amirka/minimalist-notation/blob/master/docs.md)  
* [Presets](https://github.com/mr-amirka/minimalist-notation/presets/blob/master/README.md)  
* [From author](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author.md)  



Try this tests:
* https://jsfiddle.net/Amirka/k4qzpfL9/   
* https://jsfiddle.net/Amirka/36ey02f8/   


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
mn --compile ./src --output ./dist/styles.css
```

[More about CLI](https://github.com/mr-amirka/minimalist-notation/blob/master/cli/README.md)


-------------------------

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
        require('minimalist-notation/presets/medias'),
        require('minimalist-notation/presets/prefixes'),
        require('minimalist-notation/presets/styles'),
        require('minimalist-notation/presets/states'),
        // require('minimalist-notation/presets/main'),
        // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom preset
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
        require('minimalist-notation/presets/medias'),
        require('minimalist-notation/presets/prefixes'),
        require('minimalist-notation/presets/styles'),
        require('minimalist-notation/presets/states'),
        // require('minimalist-notation/presets/main'),
        // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
        // require('./mn-my-preset'), // custom preset
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
    require('minimalist-notation/presets/medias'),
    require('minimalist-notation/presets/runtimePrefixes'),
    require('minimalist-notation/presets/styles'),
    require('minimalist-notation/presets/states'),
    // require('minimalist-notation/presets/main'),
    // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
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
<script src="https://minimalist-notation.org/dest/standalone-mn.1.5.27.js" async></script>
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
    require('minimalist-notation/presets/medias'),
    require('minimalist-notation/presets/runtimePrefixes'),
    require('minimalist-notation/presets/styles'),
    require('minimalist-notation/presets/states'),
    // require('minimalist-notation/presets/main'),
    // require('minimalist-notation/presets/normalize'), // normalize.css v8.0.1
    // require('./mn-my-preset'), // custom preset
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
With love, your mr.Amirka :)


Are you interested in the development of this project? Do your [bit](https://yasobe.ru/na/notation).  
