# Features



For version 1.10.0 (2022-02-24):

- Added "synonyms" instead of "states" to default presets.  


- Improved media query notation.  
  Example:  
  ```html
  <div class="sq100@320-768x200-600&iphone,firefox">
    <div class="bgF:h@m f12@m cF00:h">A</div>
  </div>
  ```
  ```css
  .firefox .sq100\@320-768x200-600\&iphone\,firefox {
    width: 100px;
    height: 100px;
  }
  @media (min-width: 320px) and (max-width: 768px) and (min-height: 200px) and (max-height: 600px) {
    .iphone .sq100\@320-768x200-600\&iphone\,firefox {
      width: 100px;
      height: 100px;
    }
  }
  @media (max-width: 991.98px) and (pointer: fine) and (hover: hover) {
    .bgF\:h\@m:hover {
      background: #fff;
    }
  }
  @media (max-width: 991.98px) {
    .f12\@m {
      font-size: 12px;
    }
  }
  @media (pointer: fine) and (hover: hover) {
    .cF00\:h:hover {
      color: #f00;
    }
  }
  ```


- Support for CSS variables has been added to the notation.  
  Example:  
  https://jsfiddle.net/Amirka/327q8w9n/1/  
  ```html
  <div class="--a=\#F00">
    <div class="sq100 bg--a,\#00F;p10-Fp80 bc--a bs b4">
      A
    </div>
  </div>
  <div class="--a=\#0F0 mt10">
    <div class="sq100 bg--a,\#00F;p10-Fp80 bc--a bs b4">
      B
    </div>
  </div>
  <div class="--a=\#00F mt10">
    <div class="sq100 bg--a,\#00F;p10-Fp80 bc--a bs b4">
      C
    </div>
  </div>
  ```
  ```css
  .--a\=\\\#F00 {
    --a: #F00;
  }
  .sq100 {
    width: 100px;
    height: 100px;
  }
  .bg--a\,\\\#00F\;p10-Fp80 {
    background: linear-gradient(180deg,var(--a,#00F) 10%,#fff 80%);
  }
  .b4 {
    border-width: 4px;
  }
  .--a\=\\\#0F0 {
    --a: #0F0;
  }
  .--a\=\\\#00F {
    --a: #00F;
  }
  .bc--a {
    border-color: var(--a);
  }
  .bs {
    border-style: solid;
  }
  .mt10 {
    margin-top: 10px;
  }
  ```




For version 1.9.0 (2021-08-12):

- Added powerful syntax for synonyms instead of states.
  Example:  
  ```js
  mn.media.mouse = {
    query: '(pointer: fine) and (hover: hover)',
  };
  mn.synonyms({
    odd: ':nth-child\\(2n+1\\)',
    n: ':nth-child',
    i: ':(:-webkit-input-|:-moz-|:)placeholder',
    h: ':hover@mouse', // here you can optionally use name of the media query
  });
  ```

  ```html
  <div class="c0F0:odd">...</div>
  <div class="bg0F0:n[3n+1]">...</div>
  <input class="c0:i"/>
  <div class="c00F:h">...</div>
  ```

  ```css
  .c0F0\:odd:nth-child(2n+1) {
    color: #0f0;
  }
  .bg0F0\:n\[3n\+1\]:nth-child(3n+1) {
    background: #0f0;
  }
  .c0\:i::-webkit-input-placeholder {
    color: #000;
  }
  .c0\:i::-moz-placeholder {
    color: #000;
  }
  .c0\:i::placeholder {
    color: #000;
  }
  @media (pointer: fine) and (hover: hover) {
    .c00F\:h:hover {
      color: #00f;
    }
  }
  ```

 - The use of states is deprecated but still supported.  



For version 1.8.0 (2021-08-09):

- Improved syntax of pseudo-selectors in nested scopes.  
  Example:  
  ```html
  <div class="c00F:not[.clsName:n[2n+1]]:h">...</div>
  ```

  As it was before:  
  ```css
  .c00F\:not\[\.clsName\:n\[2n\+1\]\]\:h:not(.clsName:n[2n+1]):hover {
    color: #00f;
  }
  ```

  As it became after:  
  ```css
  .c00F\:not\[\.clsName\:n\[2n\+1\]\]\:h:not(.clsName:nth-child[2n+1]):hover {
    color: #00f;
  }
  ```


For version 1.7.18 (2021-08-06):

- Fixed minor bugs in presets.
- Added props: 'overflow-scrolling' and 'image-rendering'.


For version 1.7.15 (2021-07-06):

- Fixed a critical bug with checking selectors.


For version 1.7.14 (2021-07-03):

- Fixed media priority bug.


For version 1.7.13 (2021-07-03):

- Added new syntax rule.  

  In the previous version, pluses that needed to be interpreted as part of a style
  value rather than as part of selector had to be escaped with a slash,
  but now there are some exceptions.  

  Now, if the plus is in front of the digit, then you can be left blank with a slash.  

  This is quite elegant because in CSS selector names cannot start with numbers.

  As it was before:  
  ```html
  <div class="w1/3\+100">...</div>
  ```

  ```css
  .w1\/3\\\+100 {
    width: calc(33.33% + 100px);
  }
  ```

  As it became after:
  ```html
  <div class="w1/3+100">...</div>
  ```

  ```css
  .w1\/3\+100 {
    width: calc(33.33% + 100px);
  }
  ```


For version 1.7.0 (2021-06-21):

- Added new syntax rule.  

  In the previous version, dots that needed to be interpreted as part of a style
  value rather than as part of selector had to be escaped with a slash,
  but now there are some exceptions.  

  Now, if the dot is in front of the digit, then you can be left blank with a slash.  

  This is quite elegant because in CSS selector names cannot start with numbers.  

  As it was before:  
  ```html
  <div class="cF00\.5">...</div>
  ```

  ```css
  .cF00\\\.5 {
    color: rgba(255,0,0,.5);
  }
  ```

  As it became after:  
  ```html
  <div class="cF00.5">...</div>
  ```

  ```css
  .cF00\.5 {
    color: rgba(255,0,0,.5);
  }
  ```


- Added smart parser for selectorPrefix option.  

- Added re-rendering when editing templates and matching of watched files using regular expressions.  




For version 1.6.0:

- Added error output. (added optional param "onError" and instance property "error$" as emitter)  

- Changed "layoutRow" essence (Removed extra styles).  

- Syntax of media queries are expanded.  
```html
<div
  m-n="w200@d,m&x200-400^2"
>...</div>
```
```css
@media (min-width: 992px), (max-width: 991.98px) and (min-width: 200px) and (max-width: 400px) {
  [m-n~="w200@d,m&x200-400^2"] {
    width: 200px;
  }
}
```


For version 1.5:

- The flag ``` !important ``` handler is embedded to engine of notation.

- Fixed side effect of the animation frames setting in version for build.



For version 1.3:
- the ability to specify the priority of media queries has been added to the notation
Example:
```html
<div
  m-n="w200@0-300^10"
>...</div>
```
```css
@media (max-width: 300px) {
  [m-n~="w200@0-300^10"] {
    width: 200px;
  }
}
```
