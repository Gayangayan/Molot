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


var
    paths = {
        pug : {
            location    : 'app/markups/**/*.pug',
            compiled    : 'app/markups/_pages/*.pug',
            destination : '.'
        },

        browserSync : {
            baseDir : './',
            watchPaths : ['*.html', 'css/*.css', 'js/*.js']
        }
    };

gulp.task('sass', function(){
    gulp.src(['app/sass/**/*.scss'])
        .pipe(plumber())
        //.pipe(plumber({
        //    handleError: function (err) {
        //        console.log(err);
        //        this.emit('end');
        //    }
        //}))
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}))
        .pipe(notify('css task finished'))
});
gulp.task('js', function(){
    gulp.src(['app/js/**/*.js'])
        .pipe(plumber())
        //.pipe(plumber({
        //    handleError: function (err) {
        //        console.log(err);
        //        this.emit('end');
        //    }
        //}))
        .pipe(gulp.dest('js'))
        .pipe(reload({stream:true}))
          .pipe(notify('js task finished'))
});
gulp.task('pug', function(){
    gulp.src(paths.pug.compiled)
        //.pipe(plumber())
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(pug({
            pretty: '\t',
        }))
        .pipe(gulp.dest(paths.pug.destination))
        .pipe(reload({stream:true}))
        .pipe(notify('html task finished'))
});
gulp.task('image', function(){
    gulp.src(['app/img/**/*'])
        .pipe(plumber())
        //.pipe(plumber({
        //    handleError: function (err) {
        //        console.log(err);
        //        this.emit('end');
        //    }
        //}))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('img'))
        .pipe(reload({stream:true}))
        .pipe(notify('image task finished'))
});

gulp.task('sync', function() {
    browserSync.init({
        server: {
            baseDir: paths.browserSync.baseDir
        }
    });
});
gulp.task('watch', function(){
    gulp.watch('app/js/**/*.js',['js']);
    gulp.watch('app/sass/**/*.scss',['sass']);
    gulp.watch(paths.pug.location,['pug']);
    gulp.watch('app/img/**/*.jpg',['image']);

    gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

//gulp.task('default', function(){
//
//
//    gulp.watch('app/js/**/*.js',['js']);
//    gulp.watch('app/sass/**/*.scss',['sass']);
//    gulp.watch(paths.pug.location,['pug']);
//    gulp.watch('app/img/**/*',['image']);
//
//
//    gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
//});
gulp.task('default', ['pug', 'sass', 'js', 'image', 'sync', 'watch']);
