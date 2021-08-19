import gulp from 'gulp'
import rename from 'gulp-rename'
import buildUnifiedEngine from './tools/engine.js'
import path from 'path';

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
    const engine = buildUnifiedEngine();

    let watcher = gulp.watch('docs/**/*.md');

    watcher.on('change', function (path, stats) {
        build(undefined, engine, path);
    });

    watcher.on('add', function (path, stats) {
        build(undefined, engine, path);
    });

    watcher.on('unlink', function (path, stats) {
        console.log(`File ${path} removed`);
    });

    build(undefined, engine);
    cb();
}

export default gulp.series(build);