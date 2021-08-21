import svgo from 'svgo';

export default function optimize(svgString) {
    return svgo.optimize(svgString, {
        removeScriptElement: true,
        plugins: [
            'removeDoctype',
            'removeXMLProcInst',
            'removeComments',
            'removeMetadata',
            'removeEditorsNSData',
            'cleanupAttrs',
            'mergeStyles',
            'inlineStyles',
            'minifyStyles',
            'cleanupIDs',
            'removeUselessDefs',
            'cleanupNumericValues',
            'convertColors',
            'removeUnknownsAndDefaults',
            'removeNonInheritableGroupAttrs',
            'removeUselessStrokeAndFill',
            'removeViewBox',
            'cleanupEnableBackground',
            'removeHiddenElems',
            'removeEmptyText',
            'convertShapeToPath',
            'convertEllipseToCircle',
            'moveElemsAttrsToGroup',
            'moveGroupAttrsToElems',
            'collapseGroups',
            'convertPathData',
            'convertTransform',
            'removeEmptyAttrs',
            'removeEmptyContainers',
            'mergePaths',
            'removeUnusedNS',
            'sortDefsChildren',
            'removeTitle',
            'removeDesc',
            'removeScriptElement',
        ]
    }).data;
}