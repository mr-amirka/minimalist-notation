# minimalist-notation/gulp3

This is plugin of the Minimalist Notation for the Gulp 3.


### Example

```js
const gulp = require('gulp');
const gulpMN = require('minimalist-notation/gulp3');

gulp.task('build', function() {
  return gulp.src('./src/**/*.(html?|jsx?)')
    .pipe(gulpMN('./dest/app.css', {
      selectorPrefix: '',
      presets: [
        require('mn-presets/medias'),
        require('mn-presets/prefixes'),
        require('mn-presets/styles'),
        require('mn-presets/states'),
        require('mn-presets/theme'),
        // require('./mn-my-preset'), // custom preset
      ],
    }))
    .pipe(gulp.dest('./dest/'))
});
```
