import { createHash } from 'crypto';
import { join, resolve } from 'path';
import fs from 'fs';
import axios from 'axios';
import optimize from '../svgo.js';

const cachePath = join(resolve('.'), '.tikz-cache');

async function getSvgFromTex(tex) {
    let res = await axios.get(`https://i.upmath.me/svg/${encodeURIComponent(tex)}`);
    return optimize(res.data);
}

function setToJSONReplacer(key, value) {
    if (typeof value === 'object' && value instanceof Set) {
        return [...value];
    }
    return value;
}

export let tikzCache = {
    logs: {},
    used: {},
};

tikzCache.init = function () {
    let cacheLogPath = join(cachePath, 'log.json');

    let files = fs.readdirSync(cachePath)
        .filter((f) => f.endsWith('.svg'))
        .map((f) => f.split('.').slice(0, -1).join('.'));

    let logs = {};
    if (fs.existsSync(cacheLogPath)) {
        logs = JSON.parse(fs.readFileSync(cacheLogPath).toString());
    }

    this.logs = logs;
    this.used = {};
    this.logs['.'] = new Set(files);

    for (let k of Object.keys(this.logs)) {
        if (Array.isArray(this.logs[k])) {
            this.logs[k] = new Set(this.logs[k]);
        }
    }
}

tikzCache.resetUsed = function (fileName = undefined) {
    if (fileName) {
        this.used[fileName] = new Set();
    } else {
        this.used = {};
    }
}

tikzCache.has = function (hash, file) {
    if (!this.logs[file]) this.logs[file] = new Set();
    console.log(this.logs[file]);
    return this.logs[file].has(hash);
}

tikzCache.get = function (hash, file) {
    if (fs.existsSync(hash, file)) {
        if (!this.used[file]) this.used[file] = new Set();
        this.used[file].add(hash);

        let svgPath = join(cachePath, hash + '.svg');
        return fs.readFileSync(svgPath).toString();
    }
}

tikzCache.set = function (hash, file, content) {
    if (!this.logs[file]) this.logs[file] = new Set();
    if (!this.used[file]) this.used[file] = new Set();

    fs.writeFileSync(join(cachePath, hash + '.svg'), content);
    this.logs[file].add(hash);
    this.used[file].add(hash);
}

tikzCache.getSvg = async function (tex, fileName) {
    let hash = createHash('sha256').update(tex).digest('hex').slice(0, 10);
    let svg = this.get(hash, fileName);

    if (!svg) {
        svg = await getSvgFromTex(tex);
        this.set(hash, fileName, svg);
    }

    return svg;
}

tikzCache.removeUnused = function (fileName = undefined) {
    let cached = [];
    let used = [];

    if (!fileName) {
        cached = Object.values(this.logs).reduce((acc, el) => new Set([...acc, ...el]), new Set());
        used = Object.values(this.used).reduce((acc, el) => new Set([...acc, ...el]), new Set());
    }
    else {
        cached = this.logs[fileName] || [];
        used = this.used[fileName] || [];
    }

    let unused = Array.from(cached).filter((e) => !used.has(e));
    for (let hash of unused) {
        console.log(`removing ${join(cachePath, hash + '.svg')}`);
        try {
            fs.unlinkSync(join(cachePath, hash + '.svg'));
        } catch (e) {
            // just ignore
        }

        if (fileName) {
            this.logs[fileName].delete(hash);
        } else {
            for (let k of Object.keys(this.logs)) {
                this.logs[k].delete(hash);
            }
        }
    }
}

tikzCache.saveLogs = function () {
    let logs = JSON.parse(JSON.stringify(this.logs, setToJSONReplacer));
    delete logs['.'];

    let logsPath = join(cachePath, 'log.json');
    fs.writeFileSync(logsPath, JSON.stringify(logs, undefined, 2));
}
