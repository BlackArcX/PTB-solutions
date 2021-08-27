import { unified } from 'unified'
import { gulpEngine } from 'unified-engine-gulp'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remark2rehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeMinify from 'rehype-preset-minify'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import rehypeKatex from './rehype-katex.js'
import remarkMathsteps from './remark-mathsteps.js'
import {remarkTikz, rehypeTikz} from './tikz/index.js'

export default function buildUnifiedEngine(minify = false, format = true) {
  let processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkMathsteps)
    .use(remarkTikz)
    // .use(() => tree => console.log(JSON.stringify(tree, null, 2)))
    .use(remark2rehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypeTikz)
    .use(rehypeDocument, {
      css: [
        'https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css',
        'https://cdn.rawgit.com/dreampulse/computer-modern-web-font/master/fonts.css',
      ],
      style: [
        `
        body {font-family: 'Computer Modern Serif', sans-serif; margin: 0;}
        .katex-display { overflow-x: auto; padding-top: 0.5em; }
        .katex-display > .katex { white-space: normal!important; }
        .katex-display > .base { margin: 0.25em 0!important; }
        .katex-display { margin: 0.5em 0!important; }
        table { border-collapse: collapse; margin: 1em auto; }
        table td { border-left: 1px solid #000; border-right: 1px solid #000; }
        table tr:last-child td { border-bottom: 1px solid #000; }
        table td, table th { padding: .5em 1em; }
        table thead td, table thead th { border: 1px solid #000; }
        `,
      ]
    });

  if (format && !minify) processor.use(rehypeFormat);
  if (minify) {
    // TODO: opmitize svgs
    processor.use(rehypeMinify);
  }

  processor.use(rehypeStringify);

  return gulpEngine(
    {
      name: 'gulp-remark',
      processor,
      pluginPrefix: 'remark',
      rcName: '.remarkrc',
      packageField: 'remarkConfig',
      ignoreName: '.remarkignore',
    },
    (error) => {
      if (error) throw error
    }
  )
}
