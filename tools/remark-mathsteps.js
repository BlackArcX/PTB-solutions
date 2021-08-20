import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string'
import {applyStepType} from './mathsteps/index.js';
import math from 'mathjs';

const COMMENT_RE1 = /%:(=)?\s*(\w+)?\s+([^:%]+):%/g;
const COMMENT_RE2 = /%=(=)?[\t ]*(\w+)([^\n]*)/g;

export default function plugin() {

    function replace(node, string, match, offset) {
        let value = toString(node);
        value = value.slice(0, offset + match.index) + string +
            value.slice(offset + match.index + match[0].length);

        node.data.hChildren[0].value = value;
        node.value = value

        return string.length - match[0].length;
    }

    function applyCommand(command, arg, file, showSteps=false) {
        let exprNode;
        if (arg.trim()) {
            try {
                exprNode = math.parse(arg);
            } catch (e) {
                // file
                return ''
            }
        }
        let steps = applyStepType(command, exprNode);

        if (steps.length == 0) return '';
        if (!showSteps) return steps[steps.length - 1].newNode.toTex();
        
        return '\t&= ' + steps.map((s) => s.newNode.toTex()).join('\\\\\n\t&= ');
    }


    function transformer(tree, file) {
        visit(tree, ['math', 'inlineMath'], function (node) {
            const lines = toString(node).split('\n');
            let offset = 0;

            for (let i = 0; i < lines.length; i++) {
                let matches = lines[i].matchAll(COMMENT_RE1);
                for (let match of matches) {
                    offset += replace(node, applyCommand(match[2], match[3], file, !!match[1]), match, offset);
                }

                // because regex in stateful so we need to create a new instance everytime
                let match = new RegExp(COMMENT_RE2).exec(lines[i]);
                if (match) {
                    offset += replace(node, applyCommand(match[2], match[3], file, !!match[1]), match, offset);
                }

                offset += (lines[i].length + 1);
            }

            let value = toString(node);
            if (value.includes('\\begin{steps}')) {
                value = value
                    .replace(/\\begin\{steps\}/g, '\\begin{split}')
                    .replace(/\\end\{steps\}/g, '\\end{split}');

                let lines = value.split('\n');
                value = lines[0] + '\n' + lines.slice(1, -1).join(' \\\\\n') + '\n' + lines[lines.length-1];
                node.data.hChildren[0].value = value;
            }
        });
    }

    return transformer;
}