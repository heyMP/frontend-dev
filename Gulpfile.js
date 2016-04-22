'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var shell = require('gulp-shell');
var prefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var hologram = require('gulp-hologram');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var svgSprite = require('gulp-svg-sprite');
var uglify = require('gulp-uglify');
var uglifyjs = require('gulp-uglifyjs');
var cssmin = require('gulp-minify-css');
var sassGlob = require('gulp-sass-glob');

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

gulp.task('sass', function() {
  return gulp.src('./sass/**/**/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(prefix({browsers: ['last 4 versions']}))
    .pipe(gulp.dest('./css'));
});

gulp.task('hologram', function() {
  gulp.src('hologram_config.yml')
    .pipe(hologram({bundler:true}));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch(['js/**/**.js', '!js/dist/**'], ['js']);
});

gulp.task('js', function () {
  var jsFiles = ['js/**/*.js', '!js/dist/**'];

  gulp.src(jsFiles)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/dist'));
});

// Consolidate all of our bower dependancies into single js and css files.
gulp.task('bowerdependancies', function(){
  var mainFiles = mainBowerFiles();

  if(!mainFiles.length){
    // No main files found. Skipping....
    return;
  }

  var jsFilter = filterByExtension('js');

  return gulp.src(mainFiles)
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(concat('third-party.js'))
    .pipe(gulp.dest('./js/dist/'))
    .pipe(jsFilter.restore())
    .pipe(filterByExtension('css'))
    .pipe(cssmin())
    .pipe(concat('third-party.css'))
    .pipe(gulp.dest('./css/dist/'));
});

gulp.task('svg', function () {
  // More complex configuration example
  var config = {
    shape : {
      dimension : { // Set maximum dimensions
        maxWidth : 32,
        maxHeight : 32
      }
    },
    mode : {
      symbol : true // Activate the «symbol» mode
    }
  };

  return gulp.src('svg/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest("svg/dist"));
});

//////////////////////////////
// BrowserSync Tasks
//////////////////////////////
gulp.task('browserSyncServer', function () {
  browserSync.init([
    'css/dist/*.css',
    'js/dist/*.js',
    'images/**/*',
    'fonts/**/*',
    './**/*.html',
  ], {
    server: "./",
    // proxy: "local.frontend.dev"
  });
});

gulp.task('browserSync', function () {
  browserSync.init([
    'css/dist/*.css',
    'js/dist/*.js',
    'images/**/*',
    'fonts/**/*',
    './**/*.html',
  ]);
});

//////////////////////////////
// Server Tasks
//////////////////////////////
gulp.task('build', ['js', 'svg', 'bowerdependancies']);
gulp.task('server', ['watch', 'browserSyncServer', 'sass', 'bowerdependancies', 'svg']);
gulp.task('default', ['watch', 'browserSync', 'sass', 'bowerdependancies', 'svg']);
