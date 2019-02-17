var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sourcemaps = require("gulp-sourcemaps");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;

gulp.task('clean', function() {
    del.sync(['dist/**', '!dist']);
});

gulp.task('connect', function() {
    connect.server({
        port: 4000,
        livereload: true
    });
});

gulp.task('reload', function() {
    gulp.src('index.html').pipe(connect.reload());
});

gulp.task('dev-build', ['clean'], function() {
    return gulp.src(["./src/*.js"])
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task('build', ['clean'], function() {
    return gulp.src(["./src/*.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: './src'
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task('watch', function() {
    gulp.watch(['./src/*.js', 'index.html'], ['dev-build', 'reload']);
});

gulp.task('open', function() {
    gulp.src('').pipe(open({
        uri: 'http://localhost:4000'
    }));
});

gulp.task('default', ['connect', 'open', 'watch']);
