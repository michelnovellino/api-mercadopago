const gulp = require('gulp');
const babel = require("gulp-babel");

 
 


gulp.task("babel", function () {
    return gulp.src("./babel/*.js")
        .pipe(babel({
            presets: [
            	'env',
            	// [ "es2015", { "modules": false } ]
            ]
        }))
        .pipe(gulp.dest("./"));
});


// Static server
gulp.task('server',['babel'], function() {
    gulp.watch("./babel/*.js",['babel']);
});
 
gulp.task('default', ['server']);