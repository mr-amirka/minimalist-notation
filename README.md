[Русский](https://github.com/mr-amirka/minimalist-notation/blob/master/README-ru.md)


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
* [Runtime](#runtime)  
    * [Standalone](#standalone)  
    * [Integrating "Minimalist Notation" into  React](#integrating-minimalist-notation-into-react)

* [More documentation](https://github.com/mr-amirka/minimalist-notation/blob/master/docs.md)  
* [Presets](https://github.com/mr-amirka/mn-presets/blob/master/README.md)  
* [From author](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author.md)  



Try this tests:
* https://jsfiddle.net/dzgj2sL3/
* https://jsfiddle.net/j6d8aozy/46/  


The starter build with Webpack: https://github.com/mr-amirka/mn-get-started  


I would be grateful for your feedback and comments. Write me in a [telegram](https://t.me/mr_amirka).  
With love, your mr.Amirka :)



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
        className: 'class',
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
        require('mn-presets/theme'),
        require('./theme'),
      ]
    }),
    /* ... */
  ],
  /* ... */
};
```


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

  console.log('Minimalist Notation:', mn.data);
});
```


### Standalone


```html
<script>
  (window.mnPresets || (window.mnPresets = [])).push(function(mn) {
    mn({
      fCustom: 'f50',
      fCustomBig: 'f100'
    });
  })
</script>
<script src="https://minimalist-notation.org/dest/standalone-mn.1.4.38.js" async></script>
```


### Integrating "Minimalist Notation" into  React

Example:

```js
const React = require('react');
const {render} = require('react-dom');

const reactCreateElementPatch = require('minimalist-notation/browser/reactCreateElementPatch');
const mn = require('minimalist-notation')({
  // selectorPrefix: '.mn-scope ',
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/runtimePrefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    require('mn-presets/theme'),
    ...(window.mnPresets || []),
  ],
});

mn.emitter.on(require('mn-utils/browser/stylesRenderProvider')(document, 'mn.'));

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


Are you interested in the development of this project? Do your [bit](https://yasobe.ru/na/notation).  
