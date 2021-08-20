import { unified } from 'unified'
import { gulpEngine } from 'unified-engine-gulp'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remark2rehype from 'remark-rehype'
import rehypeKatex from './rehype-katex.js'
import mathsteps from './remark-mathsteps.js'
import rehypeFormat from 'rehype-format'
import rehypeMinify from 'rehype-preset-minify'
import rehypeDocument from 'rehype-document'
import html from 'rehype-stringify'

export default function buildUnifiedEngine(minify = false, format = true) {
  let processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(mathsteps)
    // .use(() => tree => console.log(JSON.stringify(tree, null, 2)))
    .use(remark2rehype)
    .use(rehypeKatex)
    .use(rehypeDocument, {
      css: [
        'https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css',
        'https://cdn.rawgit.com/dreampulse/computer-modern-web-font/master/font/Serif/cmun-serif.css',
        'https://cdn.rawgit.com/dreampulse/computer-modern-web-font/master/fonts.css',
      ],
      style: [
        `body {font-family: 'Computer Modern Serif', sans-serif; margin: 0;}`
      ]
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
