var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', function() {
  console.log("Hello");
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('server', ['sass'], function() {
    var files = [
        'src/js/main.js'
    ];
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });

    gulp.watch("src/js/main.js").on('change', browserSync.reload);
    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});