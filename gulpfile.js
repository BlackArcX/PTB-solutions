import gulp from 'gulp'
import rename from 'gulp-rename'
import buildUnifiedEngine from './tools/engine.js'
import path from 'path';
import fs from 'fs';
import BrowserSync from 'browser-sync';

let browserSync = BrowserSync.create();

export function build(cb, engine=undefined, file="docs/**/*.md") {
    if (!engine) {
        engine = buildUnifiedEngine(true, false);
    }
    const hasGlob = file.indexOf('*') > -1;
    const dest = hasGlob ? 'dist/' : path.join('dist', path.dirname(file).split('/').slice(1).join('/'));

    return gulp.src(file)
        .pipe(engine())
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest(dest));
}

export function watch(cb) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            directory: true
        }
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