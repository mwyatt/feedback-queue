require('es6-promise').polyfill(); // required to fix postcss-import?

var settings = {
  isLocal: true,
  assetDest: 'asset/',
  watch: {
    css: 'css/**/*.css',
    js: 'js/**/*.js'
  },
  nodeModules: 'node_modules/',
  css: 'css/',
  js: 'js/',
  media: ['media/']
};

var gulp = require('gulp');
var gutil = require('gulp-util');
var tap = require('gulp-tap');
var jscs = require('gulp-jscs');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var postcssImport = require('postcss-import');
var postcssCsscomb = require('postcss-csscomb');
var postcssCombOptions = require('./.csscomb.json');
var postcssColorFunction = require('postcss-color-function');
var postcssHexrgba = require('postcss-hexrgba');
var postcssConditionals = require('postcss-conditionals');
var postcssCustomProperties = require('postcss-custom-properties');
var postcssProcesses = [
  postcssImport,
  postcssCustomProperties(),
  postcssConditionals,
  postcssHexrgba(),
  postcssColorFunction(),
  autoprefixer({browsers: ['last 1 version']})
];
var browserify = require('browserify');
var buffer = require('gulp-buffer');

gulp.task('watch', watch);
gulp.task('css', css);
gulp.task('cssTidy', cssTidy);
gulp.task('js', js);
gulp.task('jsTidy', jsTidy);

function watch() {
  gulp.watch(settings.watch.css, ['css']);
  gulp.watch(settings.watch.js, ['js']);
}

function js() {
  return gulp.src(settings.js + '**/*.bundle.js', {read: false})
    .pipe(tap(function(file) {
      file.contents = browserify(file.path, {debug: settings.isLocal})
        .bundle();
      gutil.log('build ' + file.path);
    }))
    .pipe(buffer())
    .pipe(gulp.dest(settings.assetDest));
};

function css() {
  return gulp.src(settings.css + '**/*.bundle.css')
    .pipe(postcss(postcssProcesses))
    .pipe(tap(function(file) {
      gutil.log('build ' + file.path);
    }))
    .pipe(gulp.dest(settings.assetDest));
};

function cssTidy() {
  return gulp.src(settings.css + '**/*.css')
    .pipe(postcss([postcssCsscomb(postcssCombOptions)]))
    .pipe(tap(function(file) {
      gutil.log('tidy ' + file.path);
    }))
    .pipe(gulp.dest('css'));
}

function jsTidy() {
  return gulp.src([settings.js + '**/*.js'])
    .pipe(jscs({
      configPath: '.jsTidyGoogle.json',
      fix: true
    }))
    .pipe(gulp.dest('js'));
}
