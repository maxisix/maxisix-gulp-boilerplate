'use strict';

/*******************************************************************************
DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),


    /* STYLES DEPENDENCIES */
	stylus = require('gulp-stylus'),
	sourcemaps = require('gulp-sourcemaps'),
	rupture = require('rupture'),
	autoprefixer = require('gulp-autoprefixer'),
	cmq = require('gulp-combine-media-queries'),


    /* JS DEPENDENCIES */
    jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	stylish = require('jshint-stylish'),


    /* IMAGES MINIFICATION DEPENDENCIES */
    imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),


    /* SVG SPRITES DEPENDENCIES */
    svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	rename = require('gulp-rename'),
	cheerio = require('gulp-cheerio');





/*******************************************************************************
FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var root_paths = {

	assets : './assets/'

};

var target = {

	main_stylus_src : root_paths.assets + 'stylus/styles.styl',
    stylus_src : root_paths.assets + 'stylus/**/*.styl',               // all stylus files
    css_dest : root_paths.assets + 'css',                         // where to put minified css

    js_src : root_paths.assets + 'js/*.js',						  // all js files
    js_dest : root_paths.assets + 'js/min',                       // where to put minified js

	img_src : root_paths.assets + 'images/*.{png,jpg,gif,svg}',		  // all img files
	img_dest : root_paths.assets + 'images/min',				  // where to put minified img

	svg_src : root_paths.assets + 'images/svg/*.svg',
	svg_dest : root_paths.assets

};





/*******************************************************************************
AUTOPREFIXER CONFIG
*******************************************************************************/

var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];





/*******************************************************************************
STYLUS TASK
*******************************************************************************/

gulp.task('styles', function() {
	return gulp.src(target.main_stylus_src)
		.pipe(plumber())
		.pipe(stylus({
			sourcemap: {
				inline: true,
				sourceRoot: '',
				basePath: 'css'
			},
			use:[rupture()],
		}))
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(cmq({
			log: true
		}))
		.pipe(gulp.dest(target.css_dest))
		.pipe(notify('Styles task completed'));
});





/*******************************************************************************
JS TASK
*******************************************************************************/

gulp.task('scripts', function() {
	return gulp.src(target.js_src)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(target.js_dest))
		.pipe(notify('Scripts task completed'));
});





/*******************************************************************************
IMAGES TASK
*******************************************************************************/

gulp.task('images', function() {
	return gulp.src(target.img_src)
		.pipe(plumber())
		.pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
		.pipe(gulp.dest(target.img_dest));
});





/*******************************************************************************
SVGSTORE TASK
*******************************************************************************/

gulp.task('svgstore', function() {
	return gulp.src(target.svg_src)
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio(function ($) {
            $('svg').attr('style',  'display:none');
        }))
        .pipe(gulp.dest(target.svg_dest));
});





/*******************************************************************************
DEFAULT TASK
*******************************************************************************/

gulp.task('default', ['styles','scripts','images'], function() {

});





/*******************************************************************************
WATCH TASK
*******************************************************************************/

gulp.task('watch', function() {

	gulp.watch(target.stylus_src, ['styles']);		// Watch .styl files
	gulp.watch(target.js_src, ['scripts']);			// Watch .js files

});