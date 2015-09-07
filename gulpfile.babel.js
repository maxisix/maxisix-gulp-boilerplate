'use strict';

/*******************************************************************************
DEPENDENCIES
*******************************************************************************/

import gulp from 'gulp';
import notify from 'gulp-notify';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
const reload = browserSync.reload;



/* STYLES DEPENDENCIES */
import postcss from 'gulp-postcss';
import precss from 'precss';
import sourcemaps from 'gulp-sourcemaps';
import lost from 'lost';
import autoprefixer from 'autoprefixer';
import cmq from 'gulp-combine-media-queries';



/* JS DEPENDENCIES */
import jshint from 'gulp-jshint';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import stylish from 'jshint-stylish';
import stripDebug from 'gulp-strip-debug';



/* IMAGES MINIFICATION DEPENDENCIES */
import imageOptim from 'gulp-imageoptim';



/* SVG SPRITES DEPENDENCIES */
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import rename from 'gulp-rename';
import cheerio from 'gulp-cheerio';





/*******************************************************************************
FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

const site = 'http://postcss.dev/';


const root_paths = {

    assets : './assets/',
    src : './src/'

};


const target = {

    main_postcss_src : `${root_paths.src}/postcss/styles.css`,
    postcss_src : `${root_paths.src}/postcss/**/*.css`,             // all postcss files
    css_dest : `${root_paths.assets}/css`,                          // where to put minified css

    js_src : `${root_paths.src}/js/\*.js`,                         // all js files
    js_dest : `${root_paths.assets}/js/min`,                       // where to put minified js

    img_src : `${root_paths.src}/images/**/*.{png,jpg,gif}`,      // all img files
    img_dest : `${root_paths.assets}/images`,                     // where to put minified img

    svg_src : `${root_paths.src}/images/svg/\*.svg`,
    svg_dest : `${root_paths.assets}/images/svg/svg-sprites/`,
    svgsprite_dest : `${root_paths.assets}/images/svg/svg-sprites/`

};





/*******************************************************************************
POSTCSS CONFIG
*******************************************************************************/

const AUTOPREFIXER_BROWSERS = [
    'last 2 versions',
    'ie >= 9'
];

// variables settings (colors, fonts, etc)
const vars = require('./src/postcss/configs/sitesettings');
const opts = {
    basePath: './src/postcss/configs/',
    maps: [ 'colors.yml' ]
};



/*******************************************************************************
CSS TASKS
*******************************************************************************/

gulp.task('styles', () => {
    const processors = [
        precss({}),
        lost(),
        autoprefixer(AUTOPREFIXER_BROWSERS)
    ];

    return gulp.src(target.main_postcss_src)
        .pipe(plumber( (error) => {
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

gulp.task('scripts', () => {
    return gulp.src(target.js_src)
        .pipe(plumber( (error) => {
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

gulp.task('images', () => {
    return gulp.src(target.img_src)
        .pipe(plumber( (error) => {
           gutil.log(gutil.colors.red(error.message));
            this.emit('end');
            }))
        .pipe(imageOptim.optimize())
        .pipe(gulp.dest(target.img_dest));
});






/*******************************************************************************
SVG TASKS
*******************************************************************************/

gulp.task('svgstore', () => {
    return gulp.src(target.svg_src)
        .pipe(rename({ prefix: 'icon-' }))
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(cheerio( ($) => {
            $('svg').attr('style',  'display:none');
        }))
        .pipe(gulp.dest(target.svgsprite_dest));
});

gulp.task('svgmin', () => {
    return gulp.src(target.svg_src)
        .pipe(svgmin())
        .pipe(gulp.dest(target.svg_dest));
});





/*******************************************************************************
DEFAULT TASK
*******************************************************************************/

gulp.task('default', ['styles','scripts','images','svgstore', 'svgmin'], () => {

});

gulp.task('browser-sync', () => {
    browserSync({
        proxy: site,
        tunnel: false // mettre a true si on veut un url accessible de l'extérieur
    });
});



/*******************************************************************************
WATCH TASK
*******************************************************************************/

gulp.task('watch', ['browser-sync'], () => {

    gulp.watch(target.postcss_src, ['styles']);               // Watch .css files
    gulp.watch(target.img_src, ['images']);                  // Watch images files
    gulp.watch(target.svg_src, ['svgstore', 'svgmin']);     // Watch svg files
    gulp.watch(target.js_src, ['scripts']);                // Watch .js files

});
