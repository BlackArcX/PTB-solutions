import { unified } from 'unified'
import { gulpEngine } from 'unified-engine-gulp'
import markdown from 'remark-parse'
import math from 'remark-math'
import remark2rehype from 'remark-rehype'
import katex from './rehype-katex.js'
import mathsteps from './remark-mathsteps.js'
import rehypeFormat from 'rehype-format'
import rehypeMinify from 'rehype-preset-minify'
import document from 'rehype-document'
import html from 'rehype-stringify'

export default function buildUnifiedEngine(minify = false, format = true) {
  let processor = unified()
    .use(markdown)
    .use(math)
    .use(mathsteps)
    // .use(() => tree => console.log(JSON.stringify(tree, null, 2)))
    .use(remark2rehype)
    .use(katex)
    .use(document, {
      css: ['https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css']
    });

  if (format && !minify) processor.use(rehypeFormat);
  if (minify) {
    // TODO: opmitize svgs
    processor.use(rehypeMinify);
  }

  processor.use(html);

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
