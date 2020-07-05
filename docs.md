
[Русский](https://github.com/mr-amirka/minimalist-notation/blob/master/docs-ru.md)


# Minimalist Notation Docs



* [About](#about)  
    * [Example for class name](#example-for-class-name)   
    * [Example for attr](#example-for-attr)  
* [Notation](#notation)  
    * [Essence name](#essence-name)  
    * [Essence context](#essence-context)  
    * [Media queries in notation](#media-queries-in-notation)
    * [Grouping](#grouping)  
    * [Escaping](#escaping)  
    * [Media queries generation](#media-queries-generation)  
    * [Essences of styles](#essences-of-styles)  
    * [Dynamic essences](#dynamic-essences)  
    * [Generating the essences of styles](#generating-the-essences-of-styles)  
    * [Auto prefixes](#auto-prefixes)  
    * [States](#states)  
    * [Parent/child selectors](#parent/child-selectors)   
    * [Depth](#depth)  
    * [Complex selectors](#complex-selectors)   
    * [Essences assignment (Example with container)](#essences-assignment)   
    * [Priority multiplier](#priority-multiplier)   






* [Getting started](https://github.com/mr-amirka/minimalist-notation/blob/master/README.md)  
* [Presets](https://github.com/mr-amirka/minimalist-notation/presets/blob/master/README.md)  
* [From author](https://github.com/mr-amirka/minimalist-notation/blob/master/from-author.md)    


Try this tests:  

* https://jsfiddle.net/Amirka/dkozgauy/  
* https://jsfiddle.net/Amirka/0475wbq2/  

Home page: https://minimalist-notation.org  


I would be grateful for your feedback and comments. Write me in a [telegram](https://t.me/mr_amirka).  
With love, your mr.Amirka :)


Are you interested in the development of this project? Do your [bit](https://yasobe.ru/na/notation).  



## About


Minimalist Notation (MN) is a technology for generating styles based on parsing the markup.
In the current version for web applications, the generation is done directly in the CSS.
Technology tremendously speeds up the layout process and can be used additionally with traditional technologies, or replace completely those.



The advantage over the traditional technologies of CSS-preprocessing is that the developer gets rid of the need to write CSS. CSS is generated automatically based on the notation and the style generate rules specified by the developer.
The developer no longer needs to control which styles are used in his markup and which ones are not, for from now on the styles are generated dynamically only for what is present in the markup.


PS:   
The technology is focused on the methodology Functional/Atomic CSS.  


If you are using the Functional/Atomic CSS methodology, then:  

* over time, you will at a glance understand the meaning of each name in the markup;
* you can easily standardize the rules of notation and naming;
* easy to reuse markup in the new project, if it provides the same basic set of functional styles in CSS.
* in case of making changes to the design, you only change the HTML markup.
* you have straight arms - you do not stumble on a rake with overrided styles;
* you can customize your build system for automatic generation of CSS from attributes in the markup;
* do not specify bulky attributes for long selectors in every place you want, for example, just add smoothness to the transformation. In the functional approach, this is done once, as in the CSS code below:

```css
.dn250 {
  -khtml-transition-duration: 250ms;
  -ms-transition-duration: 250ms;
  -o-transition-duration: 250ms;
  -moz-transition-duration: 250ms;
  -webkit-transition-duration: 250ms;
  transition-duration: 250ms;
}
```   


Thanks MN:  

* CSS is generated automatically from attribute values in the markup, and we save time by saving ourselves from writing "satanic" CSS-code;
* We do not have dead CSS code, because CSS is generated only for the markup that is available.
* we have the opportunity not to contact the server for "heavy" CSS-files, generating CSS in runtime.
* when making changes to the design, we only change the HTML markup, without touching the CSS.


If you want to have available to customize / change the theme of your application, replacing only the CSS file, then nothing prevents you from doing it according to the BEM naming convention methodology, limiting yourself to customizing color schemes, font sizes and other attributes that do not require changing the markup itself.  

For the purpose of customizing markup styles for a specific topic, MN provides for the possibility of manipulating global CSS rules in runtime, for example, with specific selectors:
```js
mn.css('.bgTheme', {
  backgroundColor: '#EEE'
});
mn.css('.bTheme', {
  borderColor: '#CCC'
});
```
or you can do this with the essences:
```js
mn('bgTheme', {
  style: {
    backgroundColor: '#EEE'
  }
});
mn('bTheme', {
  style: {
    borderColor: '#CCC'
  }
});
```

PS: If it is necessary to set several alternative values for one attribute by analogy with this in CSS:
```css
.theme-bg{
  background-color: #CCC;
  background-color: rgba(0,0,0,0.2);
}
```
You can do this:
```js
mn.css('.theme-bg', {
  backgroundColor: [ '#CCC',  'rgba(0,0,0,0.2)' ]
});
```

Technology "Minimalist Notation" supports:  

* parameterizable name notation
* parameterizable state;
* contexts of parent / child selectors;
* complex selector contexts;
* control the depth in the dom-tree through the notation;
* management of the priority of styles through the notation;
* media query contexts;
* grouping of substrings in notation;
* synonyms of states and media queries;
* inheritance from style essences (extension; analogue of ``` @extend ``` in SASS);
* admixture of essences (similar to ``` @include ``` in SASS);
* association of selectors with style essences;
* manipulation of global CSS styles in runtime.  



### Example for class name

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


### Example for attr

Input:

```html
<div m-n="f12 p10 mb10 f14:h cF00<.parent c0F0@mediaName sq40 bg0F0">...</div>
```

Output:

```css
@media mediaName{
  [m-n~='c0F0@mediaName']{color:rgb(0,255,0)}
}
[m-n~='f12']{font-size:12px}
[m-n~='f14:h']:hover{font-size:14px}
.parent [m-n~='cF00<.parent']{color:rgb(255,0,0)}
[m-n~='bg0F0']{background:rgb(0,255,0)}
[m-n~='sq40']{width:40px;height:40px}
[m-n~='p10']{padding:10px}
[m-n~='mb10']{margin-bottom:10px}

```


## Notation

Base format:  
```
{property}{value}@{mediaName}[...(>{depth}{childSelectors}|<{depth}{parentSelectors})@{mediaName}]
```


Record of notation in MN is divided into 2 parts:  

* name of the essence;
* context of the essence (combined selector and media query).

The substring from the beginning of the name to the first service character (``` <>. []: + @ ```) is responsible for the name of the essence.

The rest of the notation, including the first service symbol, refers to the context of the essence, within which the styles of the essence are applied (selectors and media queries).  For example:  


Example 1:  

``` ph10>1 ``` ->  
essence name: ``` ph10 ```;  essence context: ``` >1 ```

Example 2:  
``` bgF00<.theme-1 ``` ->  
essence name: ``` bgF00 ``` ;  essence context: ``` <.theme-1 ```

Example 3:  
``` cF:h  ``` ->   
essence name: ``` cF ```;  essence context: ``` :h ```

Example 4:  
``` mh-10@m>1  ``` ->   
essence name: ``` mh-10 ```;  essence context: ``` @m>1 ```


### Essence name

The part of the name that is responsible for the essence is parsed to generate styles and is also divided into 2 parts:
* essence prefix (static part, the actual name of the essence itself);
* essence suffix (parameterizable part, meaning of essence).

The prefix of the name of the essence is the first part of the name of the essence, consisting of Latin letters in lower case. It may be an abbreviation. Accordingly, the rest of the name of the essence is the prefix - the parameterizable part. For example:


Example 1:  
``` ph10 ``` ->  
essence prefix: ``` ph ```;  essence suffix: ```10 ```

Example 2:  
``` bgF00 ``` ->  
essence prefix: ``` bg ```;  essence suffix: ``` F00 ```

Example 3:  
``` cF  ``` ->   
essence prefix: ``` c ```;  essence suffix ``` F ```


### Essence context

The part of the notation responsible for the context of the essence can be divided into several parts by the ``` > ``` symbol, which is a sequence of child elements up to the target element affected by the essence. For example:  
``` essenceValue>.child1>.child2>.targetChild ```


Then, the resulting parts can be separated by the ``` < ``` symbol into several parts representing a sequence of parent elements, by which the styles of the essence take effect. For example:  
``` essenceValue<.parent1<.parent2 ```


### Media queries in notation


Each part obtained above can be separated by the ``` @ ``` symbol, which is responsible for the name of the media query, whereby the styles of the essence take effect. For example:  
``` essenceValue@mediaName ```  
``` essenceValue@mediaName<.parent ```  
``` essenceValue<.parent@mediaName ```  
``` essenceValue@mediaName>.targetChild ```  
``` essenceValue<.parent1@mediaName<.parent2 ```  
``` essenceValue@mediaName<.parent1<.parent2>.child1>.targetChild ```  


It is possible to specify the names of several media queries, for example:  

``` essenceValue@mediaName1<parent@mediaName2 ```

However, in such cases only the first found name of the media query is used. In this case, it is ``` mediaName1 ```

This is done for ease of use of the notation, for example, in cases when we specify a common media query for several attributes of a child element, but for some attributes this media query should be different:  
```html
<div m-n="(sq200|f20|f14@m)>.child1@d">
  <div class="child1">
    text
  </div>
</div>
```


The notation ``` (sq200|f20|f14@m)>.child1@d ``` is parsing like several such lines:

1. ``` sq200>.child1@d ```  
2. ``` f20>.child1@d ```  
3. ``` f14@m>.child1@d ```  

In line *3* we will receive several names of media queries, but only the first name of the media query in this sequence will take effect.  



### Grouping

Grouping helps reduce notation entry

Several parameters can be grouped together using the ``` | ``` between alternate substrings inside brackets.  


Example:

Instead of this:
```html
<div m-n="bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a"></div>
```
You can do this:
```html
<div m-n="(bc00F|bg0)>input:(h|a)"></div>
```

That is, these entries are equivalent:  
Example 1:  
``` (bc00F|bg0)>input ```  ->  ``` bc00F>input bg0>input ```  

Example 2:  
``` input:(h|a) ``` ->  ``` input:h input:a ```  

Example 3:
``` (bc00F|bg0)>input:(h|a) ```  ->  ``` bc00F>input:h bc00F>input:a bg0>input:h bg0>input:a ```




### Escaping

In the process of applying the MN, there may be situations when you need to escape service characters, for example in this case:
```html
<div m-n="pt33.3%"></div>
```
We will not get what we expect, since the dot is a service symbol.  
``` pt33.3%  ```  ->  
```css
[m-n~='pt33.3%'].3%{padding-top:33px}
```


If we want the dot to fall into the parameters of the essence, then we must escape it as follows:
```html
<div m-n="pt33\.3%"></div>
```
Thus, we get the desired:  
``` pt33\.3% ``` ->  
```css
[m-n~='pt33\\.3%']{padding-top:33.3%}
```



### Media-queries generation  


By default, the media query name is generated in CSS as it is, for example:  
INPUT:  
```html
<div m-n="f20@m f10@print">text</div>
```  

OUTPUT:  
```css
@media m {
  [m-n~='f20@m'] {
    font-size: 20px;
  }
}
@media print {
  [m-n~='f10@print'] {
    font-size: 10px;
  }
}
```


For the names of media queries in the notation can be set to synonyms.  
Example:  

INPUT:  
```js
mn.media.m = {
  query: '(max-width: 991px)',
  priority: 0
};
mn.media.m2 = {
  query: '(max-width: 767px)',
  priority: 1
};
```  

```html
<div m-n="f18@m f16@m2">text</div>
```  

OUTPUT:  

```css
@media (max-width: 991px) {
  [m-n~='f18@m'] {
    font-size: 18px;
  }
}
@media (max-width: 767px) {
  [m-n~='f16@m2'] {
    font-size: 16px;
  }
}
```



If in the media query name recognized the abbreviated entry matching the pattern:
``` {min-width?:number}-{max-width?:number}x{min-height?:number}-{max-height?:number}^{media-priority?:number} ```


then media queries be generated, for example:
INPUT:  
```html
<div m-n="f20@768-992x300-600">text</div>
```  

OUTPUT:  
```css
@media (min-width: 768px) and (max-width: 992px) and (min-height: 300px) and (max-height: 600px) {
  [m-n~='f20@768-992x300-600'] {
    font-size: 20px;
  }
}
```

The parameters of the template of the abbreviated recording of the media query in the notation are optional and some of them can be omitted, for example:  
INPUT:  
```html
<div m-n="f20@768 f30@992- f40@x600 f50@1000-1200 f3@x10-60">text</div>
```  

OUTPUT:  
```css
@media (min-width: 1000px) and (max-width: 1200px) {
  [m-n~='f50@1000-1200'] {
    font-size: 50px;
  }
}
@media (max-width: 768px) {
  [m-n~='f20@768'] {
    font-size: 20px;
  }
}
@media (min-height: 10px) and (max-height: 60px) {
  [m-n~='f3@x10-60'] {
    font-size: 3px;
  }
}
@media (min-width: 992px) {
  [m-n~='f30@992-'] {
    font-size: 30px;
  }
}
@media (max-height: 600px) {
  [m-n~='f40@x600'] {
    font-size: 40px;
  }
}
```


### Essences of styles

In MN, the essence of a style is a named atomic abstraction with a set of options on the basis of which styles are generated.
This options include:
* attributes of styles;
* ranking priority;
* an array of selectors that will be concatenated to the target selectors;
* an array of names of admixed essences;
* an array of names of essences from which the current essence is inherited;
* associative array of child essences;
* associative array of essences for specific media queries.


Essences can be of two types:
* static;  
* dynamic.  

Static essences are set by setting the essence options directly.  

Dynamic essences are set by setting of the generating function of essence options.  

How style essences are created:  

```js
// Статическая эссенция
mn('btnTheme', {
  //priority: 10, - можно задать приоритет эссенции
  //exts: [ 'dn250' /*, ... */ ], - так можно наследовать свойства других эссенций, аналогично @extend в SASS
  //include: [ 'dn250' /*, ... */ ], - так можно примешивать свойства других эссенций, аналогично @include в SASS
  style: { //здесь указываем стили эссенции
    fontSize: '16px',
    display: 'inline-block',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer'
  },
  childs: { //здесь мы можем добавлять определения для дочерних/вложенных элементов эссенции
    inner: { // inner - это просто именованное значение дочернего элемента для навигации по вложенным элементам
      selectors: [ ' .btn-inner' ], // здесь можно задать селекторы дочернего элемента
      //priority: 10, - приоритет можно задать дочерним элементам эссенции
      style: { //здесь указываем стили дочернего элемента эссенции
        width: '200px',
        maxWidth: '100%',
        color: '#FFF',
        padding: '0px 15px',
        position: 'relative',
        height: '45px',
        borderColor,
        borderStyle: 'solid',
        borderWidth: '0px',
        borderBottomWidth: '3px'
      }
      //,childs: { ... } - вложенностей может быть сколько угодно
    }
    //,other: { ... } - другой дочерний элемент
  },
  media: {
    print: {
      style: {
        display: none;
      }
    },
    //sm ...
  }
});
```

It is possible to set/change the attributes of the child elements of the essence, for example, in this way:  
```js
mn('btnTheme.inner', {
  style: {
    width: '250px'
  }
});
```


The example of how can be declared a style essence: ``` tbl ``` :
```js
mn('tbl', {
  style: {display: 'table'},
  childs: {
    cell: {
      selectors: [ '>*' ],
      style: {
        display: 'table-cell',
        verticalAlign: 'middle'
      }
    }
  }
});
```  
or so:  
```js
mn('tbl', {
  style: {display: 'table'}
});
mn('tbl.cell',  {
  selectors: [ '>*' ],
  style: {
    display: 'table-cell',
    verticalAlign: 'middle'
  }
});
```  

It works as follows:  

Example 1.  
You just write in the markup:
```html
<div m-n="tbl">
  <div>текст</div>
</div>

```  
The CSS for this markup is automatically generated:
```css
[m-n~='tbl']>*{display:table-cell;vertical-align:middle}
[m-n~='tbl']{display:table}
```

Example 2.
How it works with essence contexts:
```html
<div m-n="tbl>.example2__item">
  <div class="example2__item">
    <div>текст</div>
  </div>
  <div class="example2__item">
    <div>текст</div>
  </div>
</div>
```
Generated CSS:
```css
[m-n~='tbl>.example2__item'] .example2__item>*{display:table-cell;vertical-align:middle}
[m-n~='tbl>.example2__item'] .example2__item{display:table}
```


Example 3.  
Practical example:
```html
<div m-n="mb10 lh">
  <a class="example__button" m-n="tbl w200 h50 tc cF bg0">
    <div>centered text</div>
  </a>
</div>
```
Generated CSS:
```css
[m-n~='lh']{line-height:1}
[m-n~='bg0']{background:rgba(0,0,0,1)}
[m-n~='cF']{color:rgba(255,255,255,1)}
[m-n~='tc']{text-align:center}
[m-n~='tbl']>*{display:table-cell;vertical-align:middle}
[m-n~='tbl']{display:table}
[m-n~='h50']{height:50px}
[m-n~='w200']{width:200px}
[m-n~='mb10']{margin-bottom:10px}
```



### Dynamic essences
(Handlers generating styles)

Into functions that you specify to generate essences of  styles, are input the parameters extracted during the preliminary parsing of the essence line as a result of matching the string with the sequence of templates:  

1. ``` ^([a-z]+):name(.*?):suffix$ ```  
2. ``` ^(.*?):suffix(-i):ni$ ```  
3. ``` ^(([A-Z][a-z]+):camel|((\\-):negative?[0-9]+):num):value([a-z%]+):unit?(.*?):other?$ ```  

```js
params.ni || (params.ni = '');
params.i = params.ni ? '!important' : '';
```



PS: see function **mn-utils/routeParseProvider**


#### Generating the essences of styles
Example 1:

INPUT:  
```html
<div m-n="p20 mb20 dt5 br2">...</div>
```
```js
mn('p', p => {
  return {
    style: {
      padding: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('mb', p => {
  return {
    style: {
      marginBottom: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('dt', p => {
  return {
    style: {
      top: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
mn('br', p => {
  return {
    style: {
      borderRightWidth: (p.num || '0') + (p.unit || 'px') + p.i
    }
  };
});
```

OUTPUT:  
```css
[m-n~='p10']{padding:10px}
[m-n~='mb20']{margin-bottom:20px}
[m-n~='dt5']{top:5px}
[m-n~='br2']{border-right-width:2px}
```



Example 2:

Handler:  
```js
mn('x', p => {
  return {
    style: {
      transform: 'translate(' + ((p.x || '0') + (p.xu || 'px')) + ',' +
        ((p.y || '0') + (p.yu || 'px')) + ')' +
        (p.s ? (' scale(' + (0.01 * p.s) + ')') : '') + p.i
    }
  };
}, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([sS]([0-9]+):s)?$');
```


```html
<div m-n="x10y5">...</div>
```
```css
[m-n~='x10y5']{
  -khtml-transform:translate(10px,5px);
  -ms-transform:translate(10px,5px);
  -o-transform:translate(10px,5px);
  -moz-transform:translate(10px,5px);
  -webkit-transform:translate(10px,5px);
  transform:translate(10px,5px)
}
```


```html
<div m-n="x12">...</div>
```
```css
[m-n~='x12']{
  -khtml-transform:translate(12px,0px);
  -ms-transform:translate(12px,0px);
  -o-transform:translate(12px,0px);
  -moz-transform:translate(12px,0px);
  -webkit-transform:translate(12px,0px);
  transform:translate(12px,0px)
}
```


```html
<div m-n="x0y20%">...</div>
```
```css
[m-n~='x0y20%']{
  -khtml-transform:translate(0px,20%);
  -ms-transform:translate(0px,20%);
  -o-transform:translate(0px,20%);
  -moz-transform:translate(0px,20%);
  -webkit-transform:translate(0px,20%);
  transform:translate(0px,20%)
}
```


```html
<div m-n="x0y20">...</div>
```
```css
[m-n~='x0y20']{
  -khtml-transform:translate(0px,20px);
  -ms-transform:translate(0px,20px);
  -o-transform:translate(0px,20px);
  -moz-transform:translate(0px,20px);
  -webkit-transform:translate(0px,20px);
  transform:translate(0px,20px)
}
```


```html
<div m-n="x7%y20%">...</div>
```
```css
[m-n~='x7%y20%']{
  -khtml-transform:translate(7%,20%);
  -ms-transform:translate(7%,20%);
  -o-transform:translate(7%,20%);
  -moz-transform:translate(7%,20%);
  -webkit-transform:translate(7%,20%);
  transform:translate(7%,20%)
}
```


```html
<div m-n="x0y20s90">...</div>
```
```css
[m-n~='x0y20s90']{
  -webkit-transform:translate(0px,20px) scale(0.9);
  -moz-transform:translate(0px,20px) scale(0.9);
  -o-transform:translate(0px,20px) scale(0.9);
  -ms-transform:translate(0px,20px) scale(0.9);
  -khtml-transform:translate(0px,20px) scale(0.9);
  transform:translate(0px,20px) scale(0.9)
}
```

### Auto prefixes

You can configure auto-prefix for cross-browser property names of styles to the prefixes map following way:
```js
mn.propertiesStringify.prefixedAttrs.transform = true;
mn.propertiesStringify.prefixedAttrs.transitionDuration = true;
mn.propertiesStringify.prefixedAttrs.pointerEvents = true;
mn.propertiesStringify.prefixedAttrs.userSelect = true;
mn.propertiesStringify.prefixedAttrs.filter = true;
mn.propertiesStringify.prefixedAttrs.boxSizing = true;
```

either so:
```js
mn.utils.extend(mn.propertiesStringify.prefixedAttrs, {
  transform: true,
  transitionDuration: true,
  pointerEvents: true,
  userSelect: true,
  filter: true,
  boxSizing: true
});
```

, but better like that:
```js
mn.utils.flags([
  'transform', 'transitionDuration', 'pointerEvents', 'userSelect', 'filter', 'boxSizing'
], mn.propertiesStringify.prefixedAttrs);
```


You can specify which prefixes should be added like this:
```js
mn.utils.flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
```

### States

The state - in MN is the part of the notation after the colon (``` : ```), which can correspond to similar pseudo-selectors in terms of CSS.  
In MN, we use abbreviated entries. So for a single state name in MN, you can specify multiple arbitrary selectors.  


Input:
```html
<i
  class="ion-chevron-right"
  m-n="x10:h cF00:a f16:(h|a)"
></i>
```

```js
mn.utils.extend(mn.states, {
  h: [ ':hover' ],
  a: [ ':active', '.active' ]
});
```

Output:
```css
[m-n~='x10:h']:hover{
  -khtml-transform:translate(10px,0px);
  -ms-transform:translate(10px,0px);
  -o-transform:translate(10px,0px);
  -moz-transform:translate(10px,0px);
  -webkit-transform:translate(10px,0px);
  transform:translate(10px,0px)
}
[m-n~='cF00:a']:active,
[m-n~='cF00:a'].active{
  color:rgba(255,0,0,1)
}
[m-n~='f16:(h|a)']:hover,
[m-n~='f16:(h|a)']:active,
[m-n~='f16:(h|a)'].active{
  font-size: 16px;
}
```

If you specify any other undeclared state, then it is displayed as it is:
```css
f16:hz ->
[m-n~='f16:hz']:hz{font-size: 16px;}

f16:hover ->
[m-n~='f16:hover']:hover{font-size: 16px;}
```


*You can parameterize states through square brackets:*

```js
mn.states.n = [ ':nth-child' ];
```

```css
f16:n[3n+2] ->
[m-n~='f16:n[3n+2]']:nth-child(3n+2){font-size: 16px;}
```

PS: Due to the fact that the parentheses are the service characters MN, necessary for grouping the substrings, square brackets are used instead.  


You can write down the pseudo-class of denial without problems in the notation:
```css
f16:not[.active] ->
[m-n~='f16:not[.active]']:not(.active){font-size: 16px;}

f16:not[[type=number]] ->
[m-n~='f16:not[[type=number]]']:not([type=number]){font-size: 16px;}
```

You can specify several states in the notation:
```css
f16:(hover|active) ->
[m-n~='f16:(hover|active)']:hover, [m-n~='f16:(hover|active)']:active{font-size: 16px;}
```


In states it is possible to use non-standard pseudo-classes as synonyms:  

Input:
```js
mn.states.i = [
  '::-webkit-input-placeholder',
  '::-moz-placeholder',
  ':-ms-input-placeholder',
  '::placeholder'
];
```


```html
<input m-n="cA:i" placeholder="имя"/>
```  

Output:
```css
[m-n~='cA:i']::-webkit-input-placeholder{color:rgb(170,170,170)}
[m-n~='cA:i']::-moz-placeholder{color:rgb(170,170,170)}
[m-n~='cA:i']:-ms-input-placeholder{color:rgb(170,170,170)}
[m-n~='cA:i']::placeholder{color:rgb(170,170,170)}
```


PS: selectors with non-standard pseudo-classes and browser prefixes for validity are automatically split into separate cascading blocks.


### Parent/child selectors

Separator of parent selectors: ``` < ```

For example, the following selector is generated for notation ``` bgF00<.active ```:  

```css
.active [m-n~='bgF00<.active'] { /* ... */ }
```

So we can specify for the current element in the presence of which parent element the ``` bgF00 ``` essence style will be displayed.


Separator of child selectors: ``` > ```  
With child selectors, everything is exactly the same as with parent selectors, only the other way around.  


the following selector is generated for notation ``` bgF00>.active ```:  
```css
[m-n~='bgF00>.active'] .active { /* ... */ }
```


### Depth


To set a specific depth of nesting, we can added a number in front of the selector, for example:  

```css
/* bgF00<1.active -> */
.active>[m-n~='bgF00<1.active'] { /* ... */ }

/* bgF00<2.active -> */
.active>*>[m-n~='bgF00<2.active'] { /* ... */ }

/* bgF00<3.active -> */
.active>*>*>[m-n~='bgF00<3.active'] { /* ... */ }
```


If you want the essence styles to be active if there is any selector (in particular, the ``` active ``` class) on the current element:
```css
/* bgF00<0.active -> */
.active[m-n~='bgF00<0.active'] { /* ... */ }
```

If there is a negative sign, then we will get an affect of the style of essence to the child elements:
```css
/* bgF00<-1.active -> */
[m-n~='bgF00<-1.active']>.active { /* ... */ }

/* bgF00<-2.active -> */
[m-n~='bgF00<-2.active']>*>.active { /* ... */ }
```


You can ignore the delimiter.  
If you want the essence styles to be active if there is any selector is present on the current element (in particular, class "active"), then you can write more succinctly and get the desired output:  

```css
/* bgF00.active -> */
[m-n~='bgF00.active'].active { /* ... */ }
```


### Complex selectors


All of the above can also be applied to other selectors with attributes:  
```css
/* bgF00>[type=text] -> */
[m-n~='bgF00>[type=text]'] [type=text] { /* ... */ }

/* bgF00[type=text] -> */
[m-n~='bgF00[type=text]'][type=text] { /* ... */ }
```

An example of a more complex selector:
```css
/* bgF00.theme1.active -> */
[m-n~='bgF00.theme1.active'].theme1.active { /* ... */ }
```

Separators imply that you can jointly specify parent and child elements and states in the essence context how many you need:  
```css
/* bgF00.active<.md>.anyChild -> */
.md [m-n~='bgF00.active<.md>.anyChild'].active .anyChild { /* ... */ }
```


Example 1:  

Input:
```html
<a href="#">
  <i
    class="ion-chevron-right"
    m-n="x10<a:h cF00:a"
  ></i>
</a>
<div m-n="c0F0:a<.parent1">...</div>
<div m-n="bg02<.parent1<.parent2">...</div>
<div m-n="c065:a<0.parent1">...</div>
<div m-n="bgD852<3.parent1<.parent2:h">...</div>
```

Output:
```css
[m-n~='cF00:a'].active,
[m-n~='cF00:a']:active{
  color:rgba(255,0,0,1)
}
a:hover [m-n~='x10<a:h']{
  -khtml-transform:translate(10px,0px);
  -ms-transform:translate(10px,0px);
  -o-transform:translate(10px,0px);
  -moz-transform:translate(10px,0px);
  -webkit-transform:translate(10px,0px);
  transform:translate(10px,0px)
}
.parent1 [m-n~='c0F0:a<.parent1']:active,
.parent1 [m-n~='c0F0:a<.parent1'].active{
  color:rgba(0,255,0,1)
}
.parent1[m-n~='c065:a<0.parent1']:active,
.parent1[m-n~='c065:a<0.parent1'].active{
  color:rgba(0,102,85,1)
}
.parent2 .parent1 [m-n~='bg02<.parent1<.parent2']{
  background-color:rgba(0,0,0,0.13333333333333333)
}
.parent2:hover .parent1>*>*>[m-n~='bgD852<3.parent1<.parent2:h']{
  background-color:rgba(221,136,85,0.13333333333333333)
}
```


Example 2:  

Input:
```html
<div m-n="(sq50|bg0)<2.anyClass"></div>
<div m-n="(w50|h5|bg00F8)>5.innerItem"></div>
```
Output:
```css
.anyClass>*>[m-n~='(sq50|bg0)<2.anyClass']{
  background:rgba(0,0,0,1)
}
.anyClass>*>[m-n~='(sq50|bg0)<2.anyClass']{
  width:50px;
  height:50px
}
[m-n~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  background:rgba(0,0,255,0.5333333333333333)
}
[m-n~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  height:5px
}
[m-n~='(w50|h5|bg00F8)>5.innerItem']>*>*>*>*>.innerItem{
  width:50px
}
```


### Essences assignment
(Example with container)


Linking selectors with style essences.


For clarity, consider an approximate synthetic example of the implementation of the container from Twitter Bootstrap 3.

This is done manually with CSS:

```css
.container {
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px
}
@media (min-width: 768px) {
  .container {
    width: 750px
  }
}
@media (min-width: 992px) {
  .container {
    width: 970px
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1170px
  }
}

```

In order to do the same with MN, you can go different ways depending on your needs.  

Several laconic ways:  

Example 1.
```js
mn.assign('.container', '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)');
```

Example 2. Without the use of predefined default synonyms for media queries:  
```js
mn.assign('.container', '(mhAuto|ph15|w750@768-|w970@992-|w1170@1200-)');
```

Example 3. If we want to be able to reuse container styles in other selectors, then we can declare the container as an essence:
```js
mn('container', '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)');
```

Thus, all the power of minimalist notation will be used, for which selectors are automatically generated:  
Input:
```html
<div class="container">...</div>
<div class="container>.child">
  <div class="child"></div>
  <div class="child"></div>
</div>
<div class="parent">
  <div class="container<.parent">...</div>
</div>
```

Output:
```css
.container, .container\>\.child .child, .parent .container\<\.parent {
  margin-right: auto;
  margin-left: auto;
}
.container, .container\>\.child .child, .parent .container\<\.parent {
  padding-left: 15px;
  padding-right: 15px
}
@media (min-width: 768px) {
  .container, .container\>\.child .child, .parent .container\<\.parent {
    width: 750px
  }
}
@media (min-width: 992px) {
  .container, .container\>\.child .child, .parent .container\<\.parent {
    width: 970px
  }
}
@media (min-width: 1200px) {
  .container, .container\>\.child .child, .parent .container\<\.parent {
    width: 1170px
  }
}
```

This given example
```js
mn('container', '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)');
```
is an abbreviated form of such a declaration:
```js
mn('container', {
 exts: '(mhAuto|ph15|w750@m2-|w970@d|w1170@d2)'
});
```

In the examples above, the declaration of the essence is based on other more atomic essences of styles.

In this way, we can repeatedly reuse once created style essences in new essences.

Instead, we could declared the essence in the same way as the more atomic essences on which we were based before.

Suppose we do not yet have the atomic essences that we used in the previous examples, and we were too lazy to write them until that moment, or we are guided by some other reasons. Then we can declare the essence of the container in this way:
```js
mn('container', {
  style: {
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingLeft: '15px',
    paddingRight: '15px'
  },
  media: {
    /*
    '(min-width: 768px)': {
      style: {
        width: '750px'
      }
    },
    */
    // with synonyms:
    'm2-': {
      style: {
        width: '750px'
      }
    },
    d: {
      style: {
        width: '970px'
      }
    },
    d2: {
      style: {
        width: '1170px'
      }
    }
  }
});
```


### Priority multiplier

The MN has the ability to manipulate the priority of styles that allows you to succinctly override the effect of some other CSS rules.

Format:
```
{notation}*{multiplier:([0-9]+)}
```

Example 1:  

```html
<div m-n="h40*3"></div>
```
Output:  
```css
[m='h40*3'][m='h40*3'][m='h40*3'] {
  height: 40px;
}
```


Example 2:  

```html
<div m-n="h40.isActive*2"></div>
```
Output:  
```css
[m='h40.isActive*2'][m='h40.isActive*2'].isActive {
  height: 40px;
}
```



Example 3:  

```html
<div m-n="h40>.child1>.child2*3"></div>
```
Output:  
```css
[m='h40>.child1>.child2*3'][m='h40>.child1>.child2*3'][m='h40>.child1>.child2*3'] .child1 .child2 {
  height: 40px;
}
```
