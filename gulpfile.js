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

var watch = watchify(browserify({
  basedir:      '.',
  debug:        true,
  entries:      ['src/main.ts'],
  cache:        {},
  packageCache: {},
}).plugin(tsify));

function bundle() {
  return watch
    .transform('babelify', {
      presets:    ['es2015'],
      extensions: ['.ts'],
    })
    .bundle()
    .on('error', fancy_log)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
}

gulp.task('default',
  gulp.series(gulp.parallel('copy-html'), bundle));

watch.on('update', bundle);
watch.on('log', fancy_log);
