var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var pug = require('gulp-pug');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
var notify = require('gulp-notify');
gulp.task('sass',function(){
    gulp.src(['app/sass/**/*.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('css'))
        .pipe(reload())
        .pipe(notify('css task finished'))
});
gulp.task('js',function(){
    gulp.src(['app/js/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('js'))
        .pipe(reload())
          .pipe(notify('js task finished'))
});
gulp.task('pug',function(){
    gulp.src(['app/markups/_pages/**/*.pug'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(pug({
            pretty: '\t',
        }))
        .pipe(gulp.dest('./'))
        .pipe(reload())
        .pipe(notify('html task finished'))
});
gulp.task('image',function(){
    gulp.src(['app/img/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('img'))
        .pipe(reload())
        .pipe(notify('image task finished'))
});
gulp.task('default',function(){
    browserSync.init({
        server: "./"
    });
    gulp.watch('app/js/**/*.js',['js']);
    gulp.watch('app/sass/**/*.scss',['sass']);
    gulp.watch('app/markups/_pages/*.pug',['pug']);
    gulp.watch('app/img/**/*',['image']);
});
