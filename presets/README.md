# Minimalist Notation Default Presets


**The MN library includes this default presets if other is not seated.**


* [Auto prefixes](#auto-prefixes)   
* [Media queries](#media-queries)   
* [Other default settings](#other-default-settings)  
* [States](#states)  
* [Side names](#side-names)  
* [Essences of styles](#essences-of-styles)  
* [Normalize](#normalize)  




#### Auto prefixes

See source:  
[mn-presets/prefixes.js](https://github.com/mr-amirka/mn-presets/blob/master/prefixes.js)  
[mn-presets/runtime-prefixes.js](https://github.com/mr-amirka/mn-presets/blob/master/runtime-prefixes.js)  



#### Media queries

See source:  
[mn-presets/medias.js](https://github.com/mr-amirka/mn-presets/blob/master/medias.js)


```js
module.exports = (mn) => {
  const {media, utils} = mn;
  const {forEach} = utils;

  forEach([
    // mobile
    ['m', '(max-width: 992px)'],
    ['m2', '(max-width: 768px)'],
    ['m3', '(max-width: 640px)'],
    ['m4', '(max-width: 480px)'],
    ['m5', '(max-width: 360px)'],
    ['m6', '(max-width: 320px)'],

    ['m2-', '(min-width: 768px) and (max-width: 992px)'],
    ['m3-', '(min-width: 640px) and (max-width: 992px)'],
    ['m4-', '(min-width: 480px) and (max-width: 992px)'],
    ['m5-', '(min-width: 360px) and (max-width: 992px)'],
    ['m6-', '(min-width: 320px) and (max-width: 992px)'],

    // desktop
    ['d', '(min-width: 992px)'],
    ['d2', '(min-width: 1200px)'],
    ['d3', '(min-width: 1600px)'],
    ['d4', '(min-width: 1920px)'],

    ['-d4', '(min-width: 992px) and (max-width: 1920px)'],
    ['-d3', '(min-width: 992px) and (max-width: 1600px)'],
    ['-d2', '(min-width: 992px) and (max-width: 1200px)'],

    // if has mouse, touch pad, advanced stylus digitizers
    ['mouse', '(pointer: fine) and (hover: hover)'],

  ], (v, i) => {
    media[v[0]] = {query: v[1], priority: i};
  });

  // user agents
  forEach([
    'linux', 'mozilla', 'firefox', 'opera', 'trident', 'edge',
    'chrome', 'ubuntu', 'chromium', 'safari', 'msie', 'WebKit', 'AppleWebKit',
    'mobile', 'ie', 'webtv', 'konqueror', 'blackberry', 'android', 'iron',
    'iphone', 'ipod', 'ipad', 'mac', 'darwin', 'windows', 'freebsd',
  ], (name) => {
    media[name] = {selector: '.' + name};
  });
};
```


**Examples:**  

```html
<div class="ph15 ph10@m w1100@d2">...</div>
```  
```css
.ph15 {
  padding-left: 15px;
  padding-right: 15px;
}
@media (max-width: 992px) {
  .ph10\@m {
    padding-left: 10px;
    padding-right: 10px;
  }
}
@media (min-width: 1200px) {
  .w1100\@d2 {
    width: 1100px;
  }
}
```

-------------------------
```html
<div class="bgE bgF@safari dB@ie">...</div>
```
```css
.bgE {
  background: #eee;
}
.safari .bgF\@safari {
  background: #fff;
}
.ie .dB\@ie {
  display: block;
}
```


#### States

See source:  
[mn-presets/states.js](https://github.com/mr-amirka/mn-presets/blob/master/states.js)


| State name | Selectors                                        |
| ---------- | ------------------------------------------------ |
| a          | :active                                          |
| с          | :checked                                         |
| f          | :focus                                           |
| h          | :hover                                           |
| i          | ::-webkit-input-placeholder, ::-moz-placeholder, :-ms-input-placeholder, ::placeholder  |
| even       | :nth-child(2n)                                   |
| odd        | :nth-child(2n+1)                                 |
| n          | :nth-child                                       |
| first      | :first-child                                     |
| last       | :last-child                                      |


**Examples:**  

```html
<a class="o70:h">link</a>
```
```css
.o70\:h:hover {
  opacity: .7;
}
```

-------------------------
```html
<div class="bg01:odd">...</div>
```
```css
.bg01\:odd:nth-child(2n+1) {
  background: #000;
  background: rgba(0,0,0,.07);
}
```

-------------------------
```html
<div class="bg01:n[3n+1]">...</div>
```
```css
.bg01\:n\[3n\+1\]:nth-child(3n+1) {
  background: #000;
  background: rgba(0,0,0,.07);
}
```

-------------------------
```html
<div class="bg01:not[.anyClass]">...</div>
```
```css
.bg01\:not\[\.anyClass\]:not(.anyClass) {
  background: #000;
  background: rgba(0,0,0,.07);
}
```

-------------------------
```html
<div class="bg01:not[[class*=any]\:hover]">...</div>
```
```css
.bg01\:not\[\[class\*\=any\]\\\:hover\]:not([class*=any]:hover) {
  background: #000;
  background: rgba(0,0,0,.07);
}
```


#### Other default settings

See source:  
[mn-presets/main.js](https://github.com/mr-amirka/mn-presets/blob/master/main.js)


```js
module.exports = (mn) => {;
  mn.css({
    html: {
      '-webkit-tap-highlight-color': '#000',
    },
  });
  mn.assign({
    '*, *:before, *:after': 'bxzBorderBox',
    html: 'ovxHidden tsa',
    body: 'm0 ovxHidden',
    a: 'crPointer@mouse',
    img: 'wmax dBlock mhAuto b0',
    iframe: 'dBlock b0',
    'aside, article, main, section, header, footer, nav, video, canvas, input, textarea':
      'dBlock',
  });
};
```


#### Side names


**How sides named in the names of the essences, if such clarification may take place for the attribute in question**


Base format: ``` {baseName}{sideName}{value} ```

| Side suffix | Sides               | Description           |
| ----------- | ------------------- | --------------------- |
| t           | top                 |                       |
| b           | bottom              |                       |
| l           | left                |                       |
| r           | right               |                       |
| v           | top, bottom         | vertical              |
| vl          | top, bottom, left   | vertical and left     |
| vr          | top, bottom, right  | vertical and right    |
| h           | left, right         | horizontal            |
| ht          | top, left, right    | horizontal and top    |
| hb          | bottom, left, right | horizontal and bottom |
| lt          | left, top           |                       |
| rt          | right, bottom       |                       |
| lb          | left, bottom        |                       |
| rb          | right, bottom       |                       |


```js

const defaultSides = reduce({
  '': [ '' ],
  t: [ 'top' ],
  b: [ 'bottom' ],
  l: [ 'left' ],
  r: [ 'right' ],

  v: [ 'top', 'bottom' ],
  vl: [ 'top', 'bottom', 'left' ],
  vr: [ 'top', 'bottom', 'right' ],

  h: [ 'left', 'right' ],
  ht: [ 'left', 'right', 'top' ],
  hb: [ 'left', 'right', 'bottom' ],

  lt: [ 'top', 'left' ],
  rt: [ 'top', 'right' ],
  lb: [ 'bottom', 'left' ],
  rb: [ 'bottom', 'right' ]
}, (dst, sides, sideKey) => {
  dst[sideKey] = reduce(sides, sidesIteratee, {});
  return dst;
}, {});

```



**Examples:**  

```html
<div m="p5"></div>
```
```css
[m~="p5"]{
  padding: 5px;
}
```
-------------------------


```html
<div m="pl10"></div>
```
```css
[m~="pl10"]{
  padding-left: 10px;
}
```
-------------------------



```html
<div m="pv15"></div>
```
```css
[m~="pv15"]{
  padding-top: 15px;
  padding-bottom: 15px;
}
```
-------------------------



```html
<div m="prb15"></div>
```
```css
[m~="prb15"]{
  padding-right: 15px;
  padding-bottom: 15px;
}
```





#### Essences of styles

See source:  
[mn-presets/styles.js](https://github.com/mr-amirka/mn-presets/blob/master/styles.js)


See docs:  
[styles.minimalist-notation.org](https://styles.minimalist-notation.org)



#### Normalize

This is a fork of the [normalize.css v8.0.1](https://github.com/necolas/normalize.css)

See source:  
[mn-presets/normalize.js](https://github.com/mr-amirka/mn-presets/blob/master/normalize.js)
