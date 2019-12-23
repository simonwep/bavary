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
    const {operator} = bex;
    const leftVal = resolveValueOf(result, bex.left);
    const rightVal = resolveValueOf(result, bex.right);

    switch (operator) {
        case '|':
            return !!(leftVal || rightVal); // TODO: What about falsy values
        case '&':
            return !!(leftVal && rightVal);
        case '=':
            return leftVal === rightVal;
        case '<': {

            // TODO: Add number / array comparison?
            if (typeof leftVal === 'string' && typeof rightVal === 'string') {
                return leftVal.localeCompare(rightVal) === -1;
            }

            return false;
        }
        case '>': {
            if (typeof leftVal === 'string' && typeof rightVal === 'string') {
                return rightVal.localeCompare(leftVal) === -1;
            }

            return false;
        }
    }
}
