'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var paths = require('compass-options').paths();
var compass = require('gulp-compass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var shell = require('gulp-shell');
var prefix = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var hologram = require('gulp-hologram');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');
var svgSprite = require('gulp-svg-sprites');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var svgmin = require('gulp-svgmin');

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

gulp.task('sass', function() {
  return gulp.src(paths.sass + '/**/**/*.scss')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      config_file: './config.rb',
      css: paths.css,
      sass: paths.sass,
      bundle_exec: true,
      time: true
    }))
    .pipe(prefix())
    .pipe(gulp.dest(paths.css));
});

gulp.task('hologram', function() {
  gulp.src('hologram_config.yml')
    .pipe(hologram({bundler:true}));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass + '/**/*.scss', ['sass', 'hologram']);
  gulp.watch(paths.js + '/*.js', ['js']);
});

gulp.task('js', function () {
  var jsFiles = [paths.js + '/*.js'];

  gulp.src(jsFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(shell([
      'browserify '+ paths.js + '/scripts.js > ' + paths.js + '/dist/bundle.js'
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
  return gulp.src('svg/*.svg')
    .pipe(svgSprite({mode: "defs"}))
    .pipe(svgmin())
    .pipe(gulp.dest("svg/dist"));
});

//////////////////////////////
// BrowserSync Task
//////////////////////////////
gulp.task('browserSync', function () {
  browserSync.init([
    paths.css +  '/**/*.css',
    paths.js + '/**/*.js',
    paths.img + '/**/*',
    paths.fonts + '/**/*',
    paths.html + '/**/*.html',
  ], {
    server: {
      baseDir: "./"
    }
  });
});

//////////////////////////////
// Server Tasks
//////////////////////////////
gulp.task('build', ['hologram', 'js', 'svg', 'bowerdependancies']);
gulp.task('server', ['watch', 'browserSync', 'hologram', 'sass', 'bowerdependancies', 'svg']);
gulp.task('serve', ['server']);
