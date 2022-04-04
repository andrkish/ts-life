var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var fancy_log = require('fancy-log');


var paths = {
  pages: ['src/*.html'],
};

gulp.task('copy-html', function() {
  return gulp.src(paths.pages).pipe(gulp.dest('dist'));
});

var watchedBrowserify = watchify(browserify({
  basedir:      '.',
  debug:        true,
  entries:      ['src/main.ts'],
  cache:        {},
  packageCache: {},
}).plugin(tsify));

function watchedBundle() {
  return watchedBrowserify
    .bundle()
    .on('error', fancy_log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
}

gulp.task('default', gulp.series(gulp.parallel('copy-html'), watchedBundle));
watchedBrowserify.on('update', watchedBundle);
watchedBrowserify.on('log', fancy_log);


gulp.task('deploy',
  gulp.series(gulp.parallel('copy-html'), function() {
    return browserify({
      basedir:      '.',
      debug:        false,
      entries:      ['src/main.ts'],
      cache:        {},
      packageCache: {},
    })
      .plugin(tsify)
      .transform('babelify', {
        presets:    ['es2015'],
        extensions: ['.ts'],
      })
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
  }));
