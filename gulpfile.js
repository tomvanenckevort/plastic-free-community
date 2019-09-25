const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const nunjucks = require('gulp-nunjucks');
const njk = require('nunjucks');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const minify = require('gulp-csso');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('gulp-uglify');
const merge = require('merge-stream');
const express = require('express');
const directory = require('serve-index');

function clean() {
    return del(
        [
            'dist/**/*',
            '!dist/assets',
            'dist/assets/**',
            '!dist/assets/map',
            'dist/assets/map/**',
            '!dist/assets/map/tiles',
            '!dist/assets/map/tiles/**/*',
            'PlasticFreeCommunity.Web/assets/**/*',
            '!PlasticFreeCommunity.Web/assets/map',
            'PlasticFreeCommunity.Web/assets/map/**',
            '!PlasticFreeCommunity.Web/assets/map/tiles',
            '!PlasticFreeCommunity.Web/assets/map/tiles/**/*'
        ],
        {
            force: true
        }
    );
}

function html() {
    return src(['src/templates/**/*.njk', '!src/templates/**/_*.njk'])
        .pipe(
            nunjucks.compile(
                {},
                {
                    env: new njk.Environment([new njk.FileSystemLoader('node_modules/govuk-frontend'), new njk.FileSystemLoader('src/templates')])
                }
            )
        )
        .pipe(rename({ extname: '.html' }))
        .pipe(dest('dist'));
}

function css() {
    return src('src/scss/*.scss', { sourcemaps: true })
        .pipe(
            sass({
                includePaths: ['node_modules'],
                outputStyle: 'compressed'
            })
        )
        .pipe(minify())
        .pipe(dest('dist/assets/css', { sourcemaps: '.' }));
}

function js() {
    return src('src/js/*.js', { sourcemaps: true })
        .pipe(
            rollup(
                {
                    plugins: [
                        resolve({
                            mainFields: ['module', 'main', 'jsnext'],
                            browser: true
                        }),
                        commonjs(),
                        babel({
                            presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: '3' }]],
                            minified: true,
                            exclude: [/\/core-js\/|\/mapbox-gl\//]
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
        .pipe(dest('dist/assets/js', { sourcemaps: '.' }));
}

function assets() {
    return merge(src('src/images/**/*').pipe(dest('dist/assets/images')), src('src/fonts/**/*').pipe(dest('dist/assets/fonts')), src('src/map/**/*').pipe(dest('dist/assets/map')));
}

function watching() {
    watch(['src/templates/**/*.njk', 'src/scss/**/*.scss', 'src/js/**/*.js', 'src/images/**/*', 'src/fonts/**/*'], series(clean, parallel(html, css, js, assets), copy));
}

function copy() {
    return src(['dist/assets/**/*', '!dist/assets/map/']).pipe(dest('PlasticFreeCommunity.Web/assets'));
}

function server(cb) {
    var app = express();

    app.use(directory('dist'));
    app.use(express.static('dist'));

    app.listen(3000, function() {
        console.log('Express server started on http://localhost:3000');
    });

    cb();
}

exports.clean = clean;
exports.html = html;
exports.css = css;
exports.js = js;
exports.assets = assets;
exports.watch = watching;
exports.copy = copy;
exports.server = server;

exports.default = series(clean, parallel(html, css, js, assets), copy, server, watching);
