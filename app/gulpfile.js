'use strict';

const gulp = require('gulp');
const del = require('del');
const argv = require('yargs').argv;
const replace = require('gulp-replace');
const inject = require('gulp-inject');
const injectString = require('gulp-inject-string');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const cssmin = require('gulp-minify-css');
const sass = require('gulp-sass');
const templateCache = require('gulp-angular-templatecache');


let vendorCssFiles = [
    'public/lib/bootstrap/dist/css/bootstrap.min.css'
];

let cssFiles = [
  'public/css/reset.*css',
  'public/css/*.*css',
  'public/components/**/*.*css'
];

let vendorJsFiles = [
  'public/lib/jquery/dist/jquery.min.js',
  'public/lib/jquery-ui/jquery-ui.min.js',
  'public/lib/jquery-ui/ui/i18n/datepicker-tr.js',
  'public/lib/semantic/dist/semantic.min.js',
  'public/lib/angular/angular.min.js',
  'public/lib/moment/moment.js',
  'public/lib/angular-sanitize/angular-sanitize.min.js',
  'public/lib/angular-resource/angular-resource.min.js',
  'public/lib/angular-touch/angular-touch.min.js',
  'public/lib/angular-animate/angular-animate.min.js',
  'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
  'public/lib/angular-ui-router/release/angular-ui-router.min.js',
  'public/lib/bootstrap/dist/js/bootstrap.min.js',
  'public/lib/angular-click-outside/clickoutside.directive.js'
];

let jsFiles = [
  'public/js/**/*.js',
  'public/components/**/*.js'
];

let fontFiles = [
    'public/lib/bootstrap/dist/fonts/*'
];

let compiledFileName = 'compiled-' + new Date().getTime();

function readConfig() {
    let env = process.env.APP_ENV || argv.env || 'development';
    let data = require('./config/' + env + '.json');
    return data;
}

gulp.task('clean', () => {
    return del(['www/**/*']);
});

gulp.task('clean:after-build', ['inject:build'], () => {
    return del([
        'www/components',
        'www/css',
        'www/js',
        'www/lib',
        'www/compiled/*',
        '!www/compiled/compiled-*'
    ]);
});

gulp.task('copy', ['clean'], () => {
    var files = [].concat(vendorCssFiles, cssFiles, vendorJsFiles, jsFiles);
    files.push('!public/js/config.js');
    files.push('public/img/**/*');
    files.push('public/files/**/*');

    return gulp
        .src(files, {base: 'public/'})
        .pipe(gulp.dest('www'));
});

gulp.task('copy:templates', ['clean'], () => {
    return gulp
        .src('public/**/*.html', {base: 'public/'})
        .pipe(gulp.dest('www'));
});

gulp.task('copy:fonts', ['clean'], () => {
    return gulp
        .src(fontFiles, {base: 'public/'})
        .pipe(gulp.dest('www'));
});

gulp.task('copy:fonts-build', ['clean'], () => {
    return gulp
        .src(fontFiles)
        .pipe(gulp.dest('www/fonts'));
});

gulp.task('copy:css', ['clean'], () => {
    var files = [].concat(cssFiles);

    gulp.src(files, {base: "./"})
        .pipe(sass())
        .pipe(gulp.dest("./"));
});

gulp.task('generate-config', ['copy'], () => {
    var config = readConfig();

    return gulp
        .src(['public/js/config.js'])
        .pipe(replace('__SITE_URL__', config.SITE_URL))
        .pipe(replace('__API_URL__', config.API_URL))
        .pipe(gulp.dest('www/js'));
});

gulp.task('minify:templates', ['clean'], function () {
    return gulp.src('public/components/**/*.html')
        .pipe(templateCache({
            root: './components/'
        }))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('minify:js', ['generate-config'], () => {
    var sources = jsFiles.concat([]);
    sources.push(
        '!public/js/config.js',
        'www/js/config.js'
    );

    return gulp
        .src(sources)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('www/compiled'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('concat:vendor-js', ['copy'], () => {
    var files = [].concat(vendorJsFiles);

    return gulp
        .src(files)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('concat:js', ['minify:js', 'minify:templates', 'concat:vendor-js'], () => {
    var files = [
        'www/compiled/vendor.js',
        'www/compiled/app.min.js',
        'www/compiled/templates.js'
    ];

    return gulp
        .src(files)
        .pipe(concat(compiledFileName + '.js'))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('minify:css', ['copy'], () => {
    return gulp.src(cssFiles)
        .pipe(concat('app.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('concat:vendor-css', ['copy'], () => {
    var files = [].concat(vendorCssFiles);

    return gulp
        .src(files)
        .pipe(replace('themes/default/assets/', '../'))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('concat:css', ['minify:css', 'concat:vendor-css'], () => {
    var files = [
        'www/compiled/vendor.css',
        'www/compiled/app.min.css'
    ];

    return gulp
        .src(files)
        .pipe(concat(compiledFileName + '.css'))
        .pipe(gulp.dest('www/compiled'));
});

gulp.task('inject:dev', ['copy'], () => {
    let allFiles = [].concat(vendorCssFiles, cssFiles, vendorJsFiles, jsFiles);
    let sources = gulp.src(allFiles, {read: false});

    return gulp
        .src('public/index.html')
        .pipe(inject(sources, {relative: true, addRootSlash: true}))
        .pipe(gulp.dest('www'));
});

gulp.task('inject:build', ['concat:css', 'concat:js'], () => {
    let files = [
        'www/compiled/' + compiledFileName + '.css',
        'www/compiled/' + compiledFileName + '.js'
    ];

    let sources = gulp.src(files, {read: false});

    return gulp
        .src('public/index.html')
        .pipe(gulp.dest('www'))
        .pipe(inject(sources, {relative: true, addRootSlash: true}))
        .pipe(gulp.dest('www'));
});

gulp.task('watch:dev', () => {
    return gulp.watch(['public/**/*', '!public/lib/**/*'], ['dev']);
});

gulp.task('watch:build', () => {
    return gulp.watch(['public/**/*', '!public/lib/**/*'], ['build']);
});

gulp.task('dev', [
    'clean',
    'copy:css',
    'copy',
    'copy:templates',
    'copy:fonts',
    'generate-config',
    'inject:dev'
]);

gulp.task('build', [
    'clean',
    'copy',
    'copy:templates',
    'copy:fonts-build',
    'minify:templates',
    'generate-config',
    'minify:css',
    'concat:vendor-css',
    'concat:css',
    'minify:js',
    'concat:vendor-js',
    'concat:js',
    'inject:build',
    'clean:after-build'
]);
