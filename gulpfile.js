import gulp from 'gulp';
import rename from 'gulp-rename';
import path from 'path';
import fs from 'fs';
import BrowserSync from 'browser-sync';

import buildUnifiedEngine from './tools/engine.js';
import {tikzCache} from './tools/tikz/index.js';

let browserSync = BrowserSync.create();

export function build(cb, engine=undefined, file="docs/**/*.md") {
    if (!engine) {
        engine = buildUnifiedEngine(true, false);
    }
    const hasGlob = file.indexOf('*') > -1;
    const dest = hasGlob ? 'dist/' : path.join('dist', path.dirname(file).split('/').slice(1).join('/'));

    if (hasGlob) {
        tikzCache.init();
    } else {
        tikzCache.resetUsed(file);
    }

    return gulp.src(file)
        .pipe(engine())
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest(dest))
        .on('end', () => {
            tikzCache.removeUnused(hasGlob ? undefined : file);
            tikzCache.saveLogs();
        });
}

export function watch(cb) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            directory: true,
        },
        open: false,
    });

    const engine = buildUnifiedEngine();

    let watcher = gulp.watch('docs/**/*.md');

    watcher.on('change', function (path, stats) {
        build(undefined, engine, path);
        browserSync.reload();
    });

    watcher.on('add', function (path, stats) {
        build(undefined, engine, path);
        browserSync.reload();
    });

    watcher.on('unlink', function (file, stats) {
        const fileName = file.split('/')[file.split('/').length - 1].split('.')[0] + '.html';
        const dest = path.join('dist', path.dirname(file).split('/').slice(1).join('/'), fileName);

        if (fs.existsSync(dest)) {
            fs.unlink(dest, () => {});
        }
        console.log(`File ${dest} removed`);
    });

    build(undefined, engine);
    cb();
}

export default gulp.series(build);