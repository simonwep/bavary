import {TokenStream}                                                 from '../../misc/token-stream';
import {combine}                                                     from '../tools/combine';
import {maybe}                                                       from '../tools/maybe';
import {optional}                                                    from '../tools/optional';
import {BinaryExpression, BinaryExpressionValue, Str, ValueAccessor} from '../types';

const operatorPriority = {
    '|': 1,
    '&': 2,
    '<': 3,
    '>': 3,
    '=': 3
} as {[key: string]: number};

const operators = Object.keys(operatorPriority);

const taggedValueAccessorPath = maybe<ValueAccessor>(stream => {
    const parseValueAccessor = require('./value-accessor');
    const parseTag = require('./tag');
    const tag = parseTag(stream);

    if (!tag) {
        return null;
    }

    return {
        type: 'value-accessor',
        value: [
            tag.value,
            ...(parseValueAccessor(stream)?.value || [])
        ]
    } as ValueAccessor;
});


/**
 * Parses a binary expression
 * @param left Left-hand value
 * @param stream TokenStream
 * @param parse Parsing function
 * @param base Base priority
 */
function maybeBinary(
    left: BinaryExpression | BinaryExpressionValue,
    stream: TokenStream,
    parse: (stream: TokenStream) => ValueAccessor | Str | null,
    base = 0
): BinaryExpression | BinaryExpressionValue {
    stream.stash();

    // Parse next operator
    const operator = optional(stream, false, 'punc', ...operators)?.value;
    if (!operator) {
        return left;
    }

    // Check whenever the operator has a higher priority than the previous one
    const pr = operatorPriority[operator];
    if (pr > base) {

        // Parse right-hand value
        const rightValue = parse(stream);
        if (!rightValue) {
            stream.throwError('Expected right-hand value');
        }

        return maybeBinary({
            type: 'binary-expression',
            operator,
            right: maybeBinary(rightValue as BinaryExpressionValue, stream, parse, pr),
            left
        } as BinaryExpression, stream, parse, base);
    }

    stream.pop();
    return left;
}

module.exports = maybe<BinaryExpression>(stream => {
    const parse = combine(
        taggedValueAccessorPath,
        require('./string')
    );

    // TODO: Support parentencies

    const left = parse(stream);
    if (!left) {
        return null;
    }

    // Parse binary expression
    const bex = maybeBinary(left, stream, parse);
    if (bex.type !== 'binary-expression') {
        stream.throwError('Expected binary expression.');
    }

    return bex as BinaryExpression;
});