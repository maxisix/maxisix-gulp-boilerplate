'use strict';

/*******************************************************************************
DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload  = browserSync.reload,



    /* STYLES DEPENDENCIES */
    postcss = require('gulp-postcss'),
    precss = require('precss'),
    sourcemaps = require('gulp-sourcemaps'),
    lost = require('lost'),
    autoprefixer = require('autoprefixer'),
    cmq = require('gulp-combine-media-queries'),



    /* JS DEPENDENCIES */
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stylish = require('jshint-stylish'),
    stripDebug = require('gulp-strip-debug'),



    /* IMAGES MINIFICATION DEPENDENCIES */
    imageOptim = require('gulp-imageoptim'),



    /* SVG SPRITES DEPENDENCIES */
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    rename = require('gulp-rename'),
    cheerio = require('gulp-cheerio');





/*******************************************************************************
FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var site = site = 'http://postcss.dev/';


var root_paths = {

    assets : './assets/',
    src : './src/'

};


var target = {

    main_postcss_src : root_paths.src + 'postcss/styles.css',
    postcss_src : root_paths.src + 'postcss/**/*.css',               // all postcss files
    css_dest : root_paths.assets + 'css',                           // where to put minified css

    js_src : root_paths.src + 'js/*.js',                            // all js files
    js_dest : root_paths.assets + 'js/min',                         // where to put minified js

    img_src : root_paths.src + 'images/**/*.{png,jpg,gif}',       // all img files
    img_dest : root_paths.assets + 'images',                     // where to put minified img

    svg_src : root_paths.src + 'images/svg/*.svg',
    svg_dest : root_paths.assets + 'images/svg/svg-sprites/',
    svgsprite_dest : root_paths.assets + 'images/svg/svg-sprites/'

};





/*******************************************************************************
POSTCSS CONFIG
*******************************************************************************/

var AUTOPREFIXER_BROWSERS = [
    'last 2 versions',
    'ie >= 9'
];

// variables settings (colors, fonts, etc)
var vars = require('./src/postcss/configs/sitesettings'),
    opts = {
        basePath: './src/postcss/configs/',
        maps: [ 'colors.yml' ]
    };



/*******************************************************************************
CSS TASKS
*******************************************************************************/

gulp.task('styles', function() {
        var processors = [
            precss({}),
            lost(),
            autoprefixer(AUTOPREFIXER_BROWSERS)
        ];

    return gulp.src(target.main_postcss_src)
        .pipe(plumber(function(error){
           gutil.log(gutil.colors.red(error.message));
            this.emit('end');
            }))
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(cmq({
            log: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(target.css_dest))
        .pipe(reload({stream:true}))
        .pipe(notify('POSTCSS task completed'));
});





/*******************************************************************************
JS TASK
*******************************************************************************/

gulp.task('scripts', function() {
    return gulp.src(target.js_src)
        .pipe(plumber(function(error){
           gutil.log(gutil.colors.red(error.message));
            this.emit('end');
            }))
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
        .pipe(plumber(function(error){
           gutil.log(gutil.colors.red(error.message));
            this.emit('end');
            }))
        .pipe(imageOptim.optimize())
        .pipe(gulp.dest(target.img_dest));
});






/*******************************************************************************
SVG TASKS
*******************************************************************************/

gulp.task('svgstore', function() {
    return gulp.src(target.svg_src)
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio(function ($) {
            $('svg').attr('style',  'display:none');
        }))
        .pipe(gulp.dest(target.svgsprite_dest));
});

gulp.task('svgmin', function() {
    return gulp.src(target.svg_src)
    .pipe(svgmin())
    .pipe(gulp.dest(target.svg_dest));
});





/*******************************************************************************
DEFAULT TASK
*******************************************************************************/

gulp.task('default', ['styles','scripts','images','svgstore', 'svgmin'], function() {

});

gulp.task('browser-sync', function() {
    browserSync({
        proxy: site,
        tunnel: false // mettre a true si on veut un url accessible de l'extérieur
    });
});



/*******************************************************************************
WATCH TASK
*******************************************************************************/

gulp.task('watch', ['browser-sync'], function() {

    gulp.watch(target.postcss_src, ['styles']);               // Watch .css files
    gulp.watch(target.img_src, ['images']);                  // Watch images files
    gulp.watch(target.svg_src, ['svgstore', 'svgmin']);     // Watch svg files
    gulp.watch(target.js_src, ['scripts']);                // Watch .js files

});
