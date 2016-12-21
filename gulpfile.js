var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require("gulp-rename"),
    watch = require("gulp-watch");

gulp.task('prepare', function() {
    gulp.src(['node_modules/cordova-plugin-contacts/www/**/*',
        'node_modules/cordova-js/src/common/argscheck.js',
        'node_modules/cordova-js/src/common/utils.js'])
        .pipe(gulp.dest('lib'))
});

gulp.task('build', function() {
    gulp.src('src/js/index.js')
        .pipe(browserify({
            insertGlobals : true
        }))
        .pipe(rename("contacts-mock.js"))
        .pipe(gulp.dest('./build', {overwrite: true}));
});

gulp.task('watch', function() {
    return watch("./src/js/**/*.js", function(){
        gulp.start('build');
    });
});

gulp.task('default', ['prepare','build']);
