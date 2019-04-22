const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const mincss = require('gulp-clean-css');
const clean = require('gulp-clean');
const sourcemap = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');


const paths = {
    root: './dist',
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'dist/css',
    },

    templates: {
        src: 'src/views/**/*.pug',
        dest: 'dist',
    },


    images: {
        src: 'src/img/**/*.*',
        dest: 'dist/images/',
    },
    fonts: {
        src: 'src/fonts/**/*.woff',
        dest: 'dist/fonts/',
    }

};



function templates() {
    return gulp.src('./src/views/layouts/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.root));
}


function styles() {
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemap.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer())
        .pipe(mincss())
        .pipe(sourcemap.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
}

function cleanFiles() {
    return gulp.src(paths.root)
        .pipe(clean({read: false}))
        .pipe(clean());
}

function images() {
    return gulp.src('./src/img/**/*.*')
           .pipe(imagemin({
               progressive: true,
               optimizationLevel: 5,
           }))
           .pipe(gulp.dest('dist/images'))
}


function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
}



function server() {
    browserSync.init({
        server: paths.root,
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload); 
}

function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
}


exports.styles = styles;
exports.templates = templates;
exports.images = images;
exports.fonts = fonts;


gulp.task('default', gulp.series(
    cleanFiles,
    gulp.parallel(templates, styles, images),
    gulp.parallel(watch, server)

));
