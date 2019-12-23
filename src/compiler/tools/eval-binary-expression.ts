/* eslint-disable @typescript-eslint/no-use-before-define */
import {BinaryExpression, BinaryExpressionValue} from '../../ast/types';
import {ParsingResult}                           from '../types';
import {lookupValue}                             from './lookup-value';

/**
 * Resolves a single value in a binary-expression
 * @param result
 * @param bexv
 */
function resolveValueOf(result: ParsingResult, bexv: BinaryExpressionValue): string | number | boolean | null {
    switch (bexv.type) {
        case 'binary-expression':
            return evalBinaryExpression(result, bexv);
        case 'value-accessor':
            return lookupValue(result.obj, bexv.value) as string | number | boolean | null;
        default:
            return bexv.value;
    }
}

/**
 * Evaluates a binary expression to a single, boolsche value
 * @param result
 * @param bex
 */
export function evalBinaryExpression(result: ParsingResult, bex: BinaryExpression): boolean {
    let {operator} = bex;
    let leftVal = resolveValueOf(result, bex.left);
    let rightVal = resolveValueOf(result, bex.right);

    if (operator === '>') {
        operator = '<';
        [leftVal, rightVal] = [rightVal, leftVal];
    }

    switch (operator) {
        case '|':
            return !!(leftVal || rightVal); // TODO: What about falsy values
        case '&':
            return !!(leftVal && rightVal);
        case '=':
            return leftVal === rightVal;
        case '<': {

            if (typeof leftVal === 'string' && typeof rightVal === 'string') {
                return leftVal.localeCompare(rightVal) === -1;
            } else if (typeof leftVal === 'number' && typeof rightVal === 'number') {
                return leftVal < rightVal;
            }

            return false;
        }
    }
}
