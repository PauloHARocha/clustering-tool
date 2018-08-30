
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('default', ['styles'], function () {
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('main.js').on('change', browserSync.reload);
    gulp.watch('index.html').on('change', browserSync.reload);

    browserSync.init({
        server: ''
    });

});

gulp.task('styles', function () {
    gulp.src('sass/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.stream());
});
