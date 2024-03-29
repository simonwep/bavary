/* eslint-disable @typescript-eslint/no-use-before-define */
import {BinaryExpression, BinaryExpressionValue, UnaryExpression} from '../../ast/types';
import {NodeVariant}                                              from '../node';
import {evalLiteral}                                              from './eval-literal';

/**
 * Resolves a single value in a binary-expression
 * @param node
 * @param decl
 */

/* eslint-disable no-use-before-define */
function resolveValueOf(node: NodeVariant, decl: BinaryExpressionValue): string | number | boolean | null {
    switch (decl.type) {
        case 'binary-expression': {
            return evalBinaryExpression(node, decl);
        }
        case 'unary-expression': {
            return !evalBinaryExpression(node, decl);
        }
        case 'member-expression': {
            const res = node.lookup(decl.value) as string | number | boolean | null;
            return res === undefined ? null : res;
        }
        case 'identifier': {

            if (decl.value === 'null') {
                return null;
            }

            throw new Error(`Unknown constant: "${decl.value}"`);
        }
        case 'literal': {
            return evalLiteral(node, decl);
        }
        case 'number': {
            return decl.value;
        }
    }
}

/**
 * Returns true if val is strictly
 * @param val
 */
function strictBoolean(val: unknown): boolean {
    return !(val === false || val === undefined || val === null);
}

/**
 * Evaluates a binary expression to a single, boolsche value
 * @param node
 * @param decl
 */
export function evalBinaryExpression(node: NodeVariant, decl: BinaryExpression | UnaryExpression): boolean {

    if (decl.type === 'unary-expression') {
        return !evalBinaryExpression(node, decl.argument);
    }

    let {operator} = decl;
    let leftVal = resolveValueOf(node, decl.left);
    let rightVal = resolveValueOf(node, decl.right);

    // "a > b" is the same as "b < a"
    if (operator === '>') {
        operator = '<';
        [leftVal, rightVal] = [rightVal, leftVal];

        // "a >= b" is the same as "b <= a"
    } else if (operator === '>=') {
        operator = '<=';
        [leftVal, rightVal] = [rightVal, leftVal];
    }

    // There are duplicates which are kept for simplification purposes
    /* istanbul ignore next */
    switch (operator) {
        case '|':
            return strictBoolean(leftVal) || strictBoolean(rightVal);
        case '&':
            return strictBoolean(leftVal) && strictBoolean(rightVal);
        case '==':
            return leftVal === rightVal;
        case '!=':
            return leftVal !== rightVal;
        case '<': {
            const leftType = typeof leftVal;
            const rightType = typeof rightVal;

            if (leftType === 'string' && rightType === 'string') {
                return (leftVal as string).localeCompare(rightVal as string) === -1;
            } else if (leftType === 'number' && rightType === 'number') {
                return (leftVal as number) < (rightVal as number);
            } else if (leftVal !== null && rightVal !== null) {
                throw new Error(`Invalid types used in comparison: ${leftType} ("${leftVal}") ≠ ${rightType} ("${rightVal}")`);
            }

            return false;
        }
        case '<=': {
            const leftType = typeof leftVal;
            const rightType = typeof rightVal;

            if (leftType === 'string' && rightType === 'string') {
                return (leftVal as string).localeCompare(rightVal as string) < 1;
            } else if (leftType === 'number' && rightType === 'number') {
                return (leftVal as number) <= (rightVal as number);
            } else if (leftVal !== null && rightVal !== null) {
                throw new Error(`Invalid types used in comparison: ${leftType} ("${leftVal}") ≠ ${rightType} ("${rightVal}")`);
            }

            return false;
        }
    }
}
