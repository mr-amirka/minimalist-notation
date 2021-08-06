
# Features


For version 1.7.17 (2021-08-06):

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

  Now you can do this:  
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

  Now you can do this:  
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
