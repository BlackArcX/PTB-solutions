import Node from 'mathsteps/lib/node/index.js'
import Status from 'mathsteps/lib/node/Status.js'
import checks from 'mathsteps/lib/checks/index.js'

import basicsSearch from 'mathsteps/lib/simplifyExpression/basicsSearch/index.js'
import divisionSearch from 'mathsteps/lib/simplifyExpression/divisionSearch/index.js'
import fractionsSearch from 'mathsteps/lib/simplifyExpression/fractionsSearch/index.js'
import functionsSearch from 'mathsteps/lib/simplifyExpression/functionsSearch/index.js'
import distributeSearch from 'mathsteps/lib/simplifyExpression/distributeSearch/index.js'
import arithmeticSearch from 'mathsteps/lib/simplifyExpression/arithmeticSearch/index.js'
import breakUpNumeratorSearch from 'mathsteps/lib/simplifyExpression/breakUpNumeratorSearch/index.js'
import multiplyFractionsSearch from 'mathsteps/lib/simplifyExpression/multiplyFractionsSearch/index.js'
import collectAndCombineSearch from 'mathsteps/lib/simplifyExpression/collectAndCombineSearch/index.js'

import flattenOperands from 'mathsteps/lib/util/flattenOperands.js';
import removeUnnecessaryParens from 'mathsteps/lib/util/removeUnnecessaryParens.js';

const StepTypes = {
    // Basic simplifications
    // e.g. (...)^0 => 1
    // e.g. 2 + 2 => 4
    // e.g. 2/x/6 -> 2/(x*6)
    // e.g. 2/(x/6) => 2 * 6/x
    'simplify-basic': [basicsSearch, arithmeticSearch, divisionSearch],
    // Adding fractions, cancelling out things in fractions
    'simplify-fraction': [fractionsSearch],
    // e.g. 3/x * 2x/5 => (3 * 2x) / (x * 5)
    'collect-fraction': [multiplyFractionsSearch],
    // e.g. (2 + x) / 4 => 2/4 + x/4
    'break-fraction': [breakUpNumeratorSearch],
    // e.g. addition of polynomial terms: 2x + 4x^2 + x => 4x^2 + 3x
    // e.g. multiplication of polynomial terms: 2x * x * x^2 => 2x^3
    // e.g. multiplication of constants: 10^3 * 10^2 => 10^5
    'collect': [collectAndCombineSearch],
    // e.g. (2x + 3)(x + 4) => 2x^2 + 11x + 12
    'distribute': [distributeSearch],
    // e.g. abs(-4) => 4
    'simplify-functions': [functionsSearch],

    'simplify': [
        basicsSearch, divisionSearch, fractionsSearch, collectAndCombineSearch,
        arithmeticSearch, breakUpNumeratorSearch, multiplyFractionsSearch,
        distributeSearch, functionsSearch
    ]
}

let lastNode;

export function applyStepType(stepType, node) {
    if (!node) node = lastNode;
    if (!StepTypes[stepType] || !node || checks.hasUnsupportedNodes(node)) { return []; }

    const steps = [];

    // const originalExpressionStr = print.ascii(node);
    const MAX_STEP_COUNT = 20;
    let iters = 0;

    // Now, step through the math expression until nothing changes
    let nodeStatus = step(stepType, node);
    while (nodeStatus.hasChanged()) {
        steps.push(removeUnnecessaryParensInStep(nodeStatus));

        node = Status.resetChangeGroups(nodeStatus.newNode);
        nodeStatus = step(stepType, node);

        if (iters++ === MAX_STEP_COUNT) {
            // eslint-disable-next-line
            console.error('Math error: Potential infinite loop for expression: ' +
                node.toTex() + ', returning no steps');
            return [];
        }
    }

    if (steps.length > 0) {
        lastNode = steps[steps.length - 1].newNode;
    }

    return steps;
}

function step(stepType, node) {
    let searches = StepTypes[stepType];

    node = flattenOperands(node);
    node = removeUnnecessaryParens(node, true);

    for (let search of searches) {
        let nodeStatus = search(node);
        node = removeUnnecessaryParens(nodeStatus.newNode, true);

        if (nodeStatus.hasChanged()) {
            node = flattenOperands(node);
            nodeStatus.newNode = node.cloneDeep();
            return nodeStatus;
        }
        else {
            node = flattenOperands(node);
        }
    }

    return Node.Status.noChange(node);
}


function removeUnnecessaryParensInStep(nodeStatus) {
    if (nodeStatus.substeps.length > 0) {
        nodeStatus.substeps.map(removeUnnecessaryParensInStep);
    }

    nodeStatus.oldNode = removeUnnecessaryParens(nodeStatus.oldNode, true);
    nodeStatus.newNode = removeUnnecessaryParens(nodeStatus.newNode, true);
    return nodeStatus;
}