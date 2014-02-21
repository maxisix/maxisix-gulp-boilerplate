// Load plugins
var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	notify = require('gulp-notify'),
	imagemin = require('gulp-imagemin');


// Styles
gulp.task('styles', function(){
	return gulp.src('assets/sass/styles.scss')
		.pipe(sass({ style: 'expanded', }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('assets/css'))
        .pipe(notify("Styles task completed"));
});


// Scripts
gulp.task('scripts', function(){
	return gulp.src('assets/js/*.js')
		.pipe(jshint())
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/min'))
		.pipe(notify("Scripts task completed"));
});


// Images
gulp.task('images', function() {
  return gulp.src('assets/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(notify("Images task completed"))
    .pipe(gulp.dest('assets/images/min'));
});


// Default task
gulp.task('default', function(){
	gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

	// Watch .scss files
    gulp.watch('assets/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('assets/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('assets/images/**/*', ['images']);

});