const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const tap = require('gulp-tap');
const sass = require('gulp-sass');
const minify = require('gulp-csso');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

function clean() {
    return del(['dist/**/*', '../PlasticFreeCommunity.Web/assets/**/*'], { force: true });
}

function css() {
    return src('src/scss/*/*.scss', { sourcemaps: true })
        .pipe(
            sass({
                includePaths: ['node_modules'],
                outputStyle: 'compressed'
            })
        )
        .pipe(minify())
        .pipe(dest('dist/css', { sourcemaps: '.' }));
}

function js() {
    return src('src/js/*/').pipe(
        tap(function(folder) {
            return src(folder.path + '/*.js', { sourcemaps: true })
                .pipe(
                    rollup(
                        {
                            plugins: [
                                resolve({
                                    jsnext: true,
                                    main: true,
                                    browser: true
                                }),
                                commonjs(),
                                babel({
                                    presets: ['@babel/preset-env'],
                                    minified: true
                                })
                            ],
                            external: []
                        },
                        {
                            format: 'iife',
                            globals: {}
                        }
                    )
                )
                .pipe(uglify())
                .pipe(concat(folder.relative + '/' + folder.relative + '.js'))
                .pipe(dest('dist/js', { sourcemaps: '.' }));
        })
    );
}

function watching() {
    watch(['src/templates/*/*.html', 'src/scss/*/*.scss', 'src/js/*/*.js'], series(clean, parallel(css, js), copy));
}

function copy() {
    return src('dist/**/*').pipe(dest('../PlasticFreeCommunity.Web/assets'));
}

exports.clean = clean;
exports.css = css;
exports.js = js;
exports.watch = watching;
exports.copy = copy;

exports.default = series(clean, parallel(css, js), copy, watching);
