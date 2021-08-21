import { visit } from 'unist-util-visit'
import { removePosition } from 'unist-util-remove-position'
import { toString } from 'hast-util-to-string'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import {tikzCache} from './index.js';

const parseHtml = unified().use(rehypeParse, { fragment: true })

export function rehypeTikz() {
    return async (tree, file) => {
        let promises = [];

        visit(tree, 'element', (element) => {
            const classes =
                element.properties && Array.isArray(element.properties.className)
                    ? element.properties.className
                    : [];
            const isTikz = classes.includes('tikz-picture');
            if (!isTikz) return;

            let value = toString(element).trim();
            if (!value.startsWith('\\begin{tikzpicture}') || !value.endsWith('\\end{tikzpicture}')) {
                value = `\\begin{tikzpicture}\n${value}\n\\end{tikzpicture}`;
            }

            promises.push((async () => {
                try {
                    let result = await tikzCache.getSvg(value, file.path);
                    element.children = removePosition(parseHtml.parse(result), true).children;
                } catch (e) {
                    file.message(`Couldn't parse tikz picture ${value}`);
                }
            })());
        });

        await Promise.all(promises);
    }
}
