[English](https://github.com/mr-amirka/amirka/blob/master/README.md)


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
  .c0F0\@mediaName{color:rgb(0,255,0)!important}
}
.f12{font-size:12px}
.f14\:h:hover{font-size:14px}
.parent .cF00\<\.parent{color:rgb(255,0,0)!important}
.bg0F0{background:rgb(0,255,0)}
.sq40{width:40px!important;height:40px!important}
.p10{padding:10px!important}
.mb10{margin-bottom:10px!important}

```


    * [CLI](#cli)  
    * [Webpack Plugin](#webpack-plugin)  
    * [Runtime](#runtime)  
        * [Standalone](#standalone)  
        * [Integration](#integration)  
            * [Как интегрировать "Minimalist Notation" в Angular 6](#Как-интегрировать-minimalist-notation-в-angular-6)  
            * [Как интегрировать "Minimalist Notation" в AngularJS](#Как-интегрировать-minimalist-notation-в-angularjs)  
            * [Как интегрировать "Minimalist Notation" в React](#Как-интегрировать-minimalist-notation-в-react)  

    * [Подробная документация](https://github.com/mr-amirka/amirka/blob/master/src/README-ru.md)  
    * [Предустановленные опции](https://github.com/mr-amirka/amirka/blob/master/src/presets-ru.md)  
    * [От автора](https://github.com/mr-amirka/amirka/blob/master/src/from-author-ru.md)  

Try this tests:
* https://jsfiddle.net/j6d8aozy/51/  
* https://jsfiddle.net/j6d8aozy/46/  


Home page: http://minimalist-notation.org  


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



### Webpack Plugin

```sh
npm install amirka --save
```


```js
const MnWebpackPlugin = require('amirka/webpack-plugin');

module.exports = {
  //...
  plugins: [
    //...
    new MnWebpackPlugin({
      input: {
        './dist/styles': './src',
        './dist/other': './other'
      },
      include: [ /^.*\.(html?|jsx?)$/ ],
      exclude: [ /\/node_modules\// ],
      presets: [
        require('amirka/mn-presets/mn.medias'),
      	require('amirka/mn-presets/mn.prefixes'),
      	require('amirka/mn-presets/mn.styles'),
      	require('amirka/mn-presets/mn.states'),
      	require('amirka/mn-presets/mn.theme')
      ]
      hideInfo: true
    })

  ]
  //...
};
```

PS: см. amirka/node-mn.d.ts




## Runtime

```js
const mn = require("amirka/services/mn")
  .setPresets([
    require('amirka/mn-presets/mn.medias'),
    require('amirka/mn-presets/mn.runtime-prefixes'),
    require('amirka/mn-presets/mn.styles'),
    require('amirka/mn-presets/mn.states'),
    require('amirka/mn-presets/mn.theme')
  ]);
require('amirka/services/polyfill').andReady({
  'CSS.escape': 'assets/css.escape.shim.js',
  'setImmediate': 'assets/set-immediate.shim.js'
}).finally(() => {
  mn.getCompiler('m').recursiveCheck(document)
  mn.compile();

  console.log('minimalistNotation', mn.data);
});

```


### Standalone


```html
<script src="https://dartline.ru/assets/standalone-mn.js" async></script>
```


## Integration


### Как интегрировать "Minimalist Notation" в Angular 6


```ts

require("amirka/services/mn").setPresets([
  require('amirka/mn-presets/mn.medias'),
  require('amirka/mn-presets/mn.runtime-prefixes'),
  require('amirka/mn-presets/mn.styles'),
  require('amirka/mn-presets/mn.states'),
  require('amirka/mn-presets/mn.theme')
]);

//DIRECTIVES
import { MDirective } from 'amirka/angular-mn';

@NgModule({
  imports: [
    /* ... */
  ],
  declarations: [
    MDirective,
    /* ... */
  ],
  bootstrap: [
    //RootComponent
  ]
})
export class AppModule {}


```


### Как интегрировать "Minimalist Notation" в AngularJS


```js

require("amirka/services/mn").setPresets([
  require('amirka/mn-presets/mn.medias'),
  require('amirka/mn-presets/mn.runtime-prefixes'),
  require('amirka/mn-presets/mn.styles'),
  require('amirka/mn-presets/mn.states'),
  require('amirka/mn-presets/mn.theme')
]);

const app = angular.module('app', [ /* ...*/ ]);
require('amirka/angularjs-mn')(app);
//...



```


### Как интегрировать "Minimalist Notation" в React

Example:

```jsx
// index.jsx
import React from 'react';
import { render } from 'react-dom';
import { Root } from './components/root';

require("amirka/services/mn").setPresets([
  require('amirka/mn-presets/mn.medias'),
  require('amirka/mn-presets/mn.runtime-prefixes'),
  require('amirka/mn-presets/mn.styles'),
  require('amirka/mn-presets/mn.states'),
  require('amirka/mn-presets/mn.theme')
]);
require('amirka/services/polyfill').andReady({
  'CSS.escape': 'assets/css.escape.shim.js'
}).finally(() => [].forEach.call(
  document.querySelectorAll('[root]'),
  (node) => render(<Root/>, node)
));


//root.jsx
import React, { Component } from 'react';
import { MyComponent } from './my-component';

export class Root extends Component {
	render() {
		return (<MyComponent/>);
	}
}

// my-component.jsx
import React, { Component } from 'react';
import { withMn, MnFrame } from 'amirka/react-mn';


class _MyComponent extends Component {
  render() {
    return (
      <div m="tbl c0F0 bg0 w h100vh tc f40">
        <div>
          <div>Hello React!</div>
          <MnFrame m="b0 bc00 bsSolid">
            <div m="sq10 bgF"></div>
          </MnFrame>
        </div>
      </div>
    );
  }
}

export const MyComponent = withMn(_MyComponent);

```

PS: MnFrame - компонент, который отображается в iframe
