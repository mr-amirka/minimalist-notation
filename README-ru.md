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
* [Runtime](#runtime)  
    * [Standalone](#standalone)  
    * [Integration](#integration)  
        * [Integrating "Minimalist Notation" into Angular 6](#integrating-minimalist-notation-into-angular-6)  
        * [Integrating "Minimalist Notation" into AngularJS](#integrating-minimalist-notation-into-angularjs)  
        * [Integrating "Minimalist Notation" into React](#integrating-minimalist-notation-into-react)  



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
npm install node-mn --save
```



```js
const { compileSource } = require('node-mn');

compileSource({
  watch: true,
  path: './node_modules/',
  entry: {
    './dist/styles': './src',
    './dist/other': './other',
    './dist/market.app': {
       include: [ /^.*?(common\.app|market\.app\/src)\/.*\.(html?|jsx?)$/ ]
     }
  },
  exclude: [ /^.*\/?node_modules\/.*?\/node_modules\/.*$/ ],
  presets: [
    require('mn-presets/medias'),
    require('mn-presets/prefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    require('mn-presets/theme')
    //,require('common.app/mn-theme')
  ]
});

module.exports = {
  //...
  plugins: [
    //...
  ]
  //...
};
```

PS: see node-mn/index.d.ts

<field key="region" dbtype="varchar" precision="255" phptype="string" null="false" default="" index="fulltext" />


## Runtime

```js
const mn = require("services/mn")
  .setPresets([
    require('mn-presets/medias'),
    require('mn-presets/runtime-prefixes'),
    require('mn-presets/styles'),
    require('mn-presets/states'),
    require('mn-presets/theme')
  ]);
require('mn-services/ready')(() => {
  mn.getCompiler('m').recursiveCheck(document)
  mn.compile();

  console.log('minimalistNotation', mn.data);
});

```


### Standalone


```html
<script src="https://dartline.ru/assets/last-standalone-mn.js" async></script>
```


## Integration


### Integrating "Minimalist Notation" into Angular 6


```ts

import * as mn from 'services/mn';
import * as mnMedias from 'mn-presets/medias';
import * as mnPrefixes from 'mn-presets/runtime-prefixes';
import * as mnStyles from 'mn-presets/styles';
import * as mnStates from 'mn-presets/states';
import * as mnTheme from 'mn-presets/theme';

mn.setPresets([
  mnMedias,
  mnPrefixes,
  mnStyles,
  mnStates,
  mnTheme
]);

//DIRECTIVES
import { MDirective } from 'angular-mn';

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


### Integrating "Minimalist Notation" into AngularJS


```js

require("mn-services/mn").setPresets([
  require('mn-presets/medias'),
  require('mn-presets/runtime-prefixes'),
  require('mn-presets/styles'),
  require('mn-presets/states'),
  require('mn-presets/theme')
]);

const app = angular.module('app', [ /* ...*/ ]);
require('angularjs-mn')(app);
//...



```


### Integrating "Minimalist Notation" into  React

Example:

```js
// index.jsx
const React = require('react');
const { render } = require('react-dom');
const Root = require('./components/root');

require("mn-services/mn").setPresets([
  require('mn-presets/medias'),
  require('mn-presets/runtime-prefixes'),
  require('mn-presets/styles'),
  require('mn-presets/states'),
  require('mn-presets/theme')
]);

require('mn-services/ready')(() => [].forEach.call(
  document.querySelectorAll('[root]'),
  node => render(<Root/>, node)
));


//root.jsx
const React = require('react');
const { Component } = React;
const MyComponent = require('./my-component');

class Root extends Component {
	render() {
		return (<MyComponent/>);
	}
}

module.exports = Root;


// my-component.jsx
const React = require('react');
const { Component } = React;

const { withMn, MnFrame } = require('react-mn');


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

module.exports = withMn(_MyComponent);

```

PS: MnFrame - the component that is displayed in the iframe
