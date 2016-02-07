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
var cssmin = require('gulp-minify-css');

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
    .pipe(sass())
    .pipe(prefix())
    .pipe(gulp.dest('./css'));
});

gulp.task('hologram', function() {
  gulp.src('hologram_config.yml')
    .pipe(hologram({bundler:true}));
});

gulp.task('watch', function() {
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('js/*.js', ['js']);
});

gulp.task('js', function () {
  var jsFiles = ['js/*.js'];

  gulp.src(jsFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(shell([
      'browserify js/scripts.js > js/dist/bundle.js'
    ], {
      ignoreErrors: true
    }));
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
    'css/**/*.css',
    'js/**/*.js',
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
    'css/**/*.css',
    'js/**/*.js',
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
