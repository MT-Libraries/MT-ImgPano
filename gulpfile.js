var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('js', function() {
    return gulp.src('./src/js/threejs/*.js')
        .pipe(concat('three.js'))
        .pipe(gulp.dest('./src/js/vendors/'));
});