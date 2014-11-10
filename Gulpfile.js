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
var hologram = require('gulp-hologram');

gulp.task('sass', function() {
  return gulp.src(paths.sass + '/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: paths.css,
      sass: paths.sass,
      bundle_exec: true,
      time: true
    }))
    .pipe(prefix("last 2 versions", "> 1%"))
    .pipe(gulp.dest(paths.css))
    .pipe(gulp.dest(paths.assets))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('hologram', function() {
  gulp.src('config.yml')
    .pipe(hologram({bundler:true}));
})

gulp.task('watch', function() {
  gulp.watch(paths.sass + '/**/*.scss', ['sass']);
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
      baseDir: "app/"
    }
  });
});

//////////////////////////////
// Server Tasks
//////////////////////////////
gulp.task('server', ['watch', 'browserSync']);
gulp.task('serve', ['server']);
