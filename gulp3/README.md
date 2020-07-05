# minimalist-notation/gulp3

This is plugin of the Minimalist Notation for the Gulp 3.


```sh
npm install minimalist-notation --save-dev
```


### Example

```js
const gulp = require('gulp');
const gulpMN = require('minimalist-notation/gulp3');

gulp.task('build', function() {
  return gulp.src('./src/**/*.html')
    .pipe(gulpMN('./dest/app.css', {
      // selectorPrefix: '',
      // attrs: {'class': 'class'},
      // altColor: 'off' // disable alternate color generation
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


## Interface
```ts
interface gulpMNOptions {
  selectorPrefix?: string,
  output?: string | null,
  altColor?: string | null,
  attrs?: string | string[] | {[fromName:string]: string},
  presets?: MnPreset[]
}
```


## Default options

| option          | value                                              |
| --------------- | -------------------------------------------------- |
| selectorPrefix  | ''                                                 |
| output          | './mn.styles.css'                                  |
| altColor        | 'on'                                               |
| attrs           | {'class': 'class', 'className': 'class', 'm': 'm'} |
| presets         | [  require('minimalist-notation/presets/medias'), require('minimalist-notation/presets/prefixes'), require('minimalist-notation/presets/styles'), require('minimalist-notation/presets/states'), require('minimalist-notation/presets/main') ] |
