
# Features


For version 1.6.0:

- Added error output. (added optional param "onError" and instance property "error$" as emitter)  

- Changed "layoutRow" essence (Removed extra styles).  

- Syntax of media queries are expanded.  
```html
<div
  m="w200@d,m&x200-400^2"
>...</div>
```
```css
@media (min-width: 992px), (max-width: 991.98px) and (min-width: 200px) and (max-width: 400px) {
  [m~="w200@d,m&x200-400^2"] {
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
  m="w200@0-300^10"
>...</div>
```
```css
@media (max-width: 300px) {
  [m~="w200@0-300^10"] {
    width: 200px;
  }
}
```
