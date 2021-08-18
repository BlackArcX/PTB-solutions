import gulp from 'gulp'
import rename from 'gulp-rename'
import buildGulpEngine from './tools/engine.js'

export function build(cb, engine=undefined, file="docs/**/*.md") {
    if (!engine) {
        engine = buildGulpEngine(true, false);
    }

    return gulp.src(file)
        .pipe(engine())
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('dist/'));
}

export function watch(cb) {
    const engine = buildGulpEngine();

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