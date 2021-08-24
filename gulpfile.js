import gulp from 'gulp';
import ClusterSrc from 'gulp-cluster-src'

import rename from 'gulp-rename';
import path from 'path';
import fs from 'fs';
import BrowserSync from 'browser-sync';

import buildUnifiedEngine from './tools/engine.js';
import { tikzCache } from './tools/tikz/index.js';

let browserSync = BrowserSync.create();
let clusterSrc = ClusterSrc(gulp);

export function build(cb, engine = undefined, file = "docs/**/*.md") {
    if (!engine) {
        engine = buildUnifiedEngine(true, false);
    }
    const hasGlob = file.indexOf('*') > -1;
    const dest = hasGlob ? 'dist/' : path.join('dist', path.dirname(file).split('/').slice(1).join('/'));

    function process(src, file = undefined) {
        return src.pipe(engine())
            .pipe(rename({ extname: '.html' }))
            .pipe(gulp.dest(dest))
            .on('end', () => {
                tikzCache.removeUnused(file);
                tikzCache.saveLogs();
            });
    }

    if (hasGlob) {
        tikzCache.init();
        // clusterSrc(file, {taskName: 'build'}, (src) => process(src))
        let src = gulp.src(file);
        return process(src);
    } else {
        let src = gulp.src(file);
        return process(src, file);
    }
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
        tikzCache.resetUsed(path);
        build(undefined, engine, path);

        tikzCache.removeUnused(path);
        tikzCache.saveLogs();
        browserSync.reload();
    });

    watcher.on('add', function (path, stats) {
        if (path.includes('copy')) return;
        tikzCache.resetUsed(path);
        build(undefined, engine, path);

        tikzCache.saveLogs();
        browserSync.reload();
    });

    watcher.on('unlink', function (file, stats) {
        const fileName = file.split('/')[file.split('/').length - 1].split('.')[0] + '.html';
        const dest = path.join('dist', path.dirname(file).split('/').slice(1).join('/'), fileName);

        if (fs.existsSync(dest)) {
            fs.unlink(dest, () => { });
        }
        console.log(`File ${dest} removed`);
    });

    build(undefined, engine);
    cb();
}

export default gulp.series(build);