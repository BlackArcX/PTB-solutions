import { visit } from 'unist-util-visit';

export function remarkTikz() {
    return (tree) => {
        visit(tree, ['code'], function (node) {
            if (node.lang === 'tikz') {
                node.type = 'tikz-picture';
                node.data = {
                    hName: 'div',
                    hProperties: {
                        className: ['tikz-picture'],
                        style: `text-align: center;`
                    },
                    hChildren: [{
                        type: 'text',
                        value: node.value,
                    }],
                };
            }
        });
    }
}
