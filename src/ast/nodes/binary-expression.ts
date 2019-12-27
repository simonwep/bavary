import {TokenStream}                                            from '../../misc/token-stream';
import {identifier, number, string, tag, valueAccessor}         from '../internal';
import {combine}                                                from '../tools/combine';
import {expect}                                                 from '../tools/expect';
import {maybe}                                                  from '../tools/maybe';
import {optional}                                               from '../tools/optional';
import {skipWhitespace}                                         from '../tools/skip-whitespace';
import {BinaryExpression, BinaryExpressionValue, ValueAccessor} from '../types';

const operatorPriority = {
    '|': 1,
    '&': 2,
    '=': 3,
    '!': 3,
    '<': 4,
    '>': 4
} as {[key: string]: number};

const operators = Object.keys(operatorPriority);

const taggedValueAccessorPath = maybe<ValueAccessor>(stream => {
    const tagVal = tag(stream);

    if (!tagVal) {
        return null;
    }

    return {
        type: 'value-accessor',
        value: [
            tagVal.value,
            ...(valueAccessor(stream)?.value || [])
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
    parse: (stream: TokenStream) => BinaryExpressionValue | null,
    base = 0
): BinaryExpression | BinaryExpressionValue {
    stream.stash();

    // Parse next operator
    const operator = optional(stream, false, 'punc', ...operators)?.value;
    if (!operator) {
        return left;
    }

    // It may be a not-equal operator
    if (operator === '!' && !optional(stream, true, 'punc', '=')) {
        stream.throwError('Expected "="');
    }

    // Check whenever the operator has a higher priority than the previous one
    const pr = operatorPriority[operator];
    if (pr > base) {

        // Parse right-hand value
        skipWhitespace(stream);
        const rightValue = parse(stream);
        if (!rightValue) {
            stream.throwError('Expected right-hand value');
        }

        return maybeBinary({
            type: 'binary-expression',
            operator: operator === '!' ? `${operator}=` : operator, // TODO: That's ugly, refactor it
            right: maybeBinary(rightValue, stream, parse, pr),
            left
        } as BinaryExpression, stream, parse, base);
    }

    stream.pop();
    return left;
}

export const binaryExpression = maybe<BinaryExpression>(stream => {
    if (!optional(stream, false, 'punc', '(')) {
        return null;
    }

    const parse = combine<BinaryExpressionValue | null>(
        taggedValueAccessorPath,
        binaryExpression,
        string,
        number,
        identifier
    );

    const left = parse(stream);
    if (!left) {
        return null;
    }

    // Parse binary expression
    const bex = maybeBinary(left, stream, parse);
    if (bex.type !== 'binary-expression') {
        stream.throwError('Expected binary expression.');
    }

    expect(stream, false, 'punc', ')');
    return bex as BinaryExpression;
});
