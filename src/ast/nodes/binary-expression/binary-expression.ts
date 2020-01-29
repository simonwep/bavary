import {TokenStream}                                              from '../../../tokenizer/token-stream';
import {combine}                                                  from '../../tools/combine';
import {maybe}                                                    from '../../tools/maybe';
import {BinaryExpression, BinaryExpressionValue, UnaryExpression} from '../../types';
import {parseIdentifier}                                          from '../identifier';
import {parseLiteral}                                             from '../literal';
import {parseMemberExpression}                                    from '../member-expression';
import {parseNumber}                                              from '../number';
import {parseUnaryExpression}                                     from './index';
import {operatorPriority}                                         from './operator-priority';

/**
 * Parses a binary expression
 * @param negated
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

    const operator = stream.optional(false, 'punc') as string
        + (stream.optional(true, 'punc') || '');

    if (!operator || !(operator in operatorPriority)) {
        stream.pop();
        return left;
    }

    // Check whenever the operator has a higher priority than the previous one
    const pr = operatorPriority[operator];
    if (pr > base) {

        // Parse right-hand value
        stream.consumeSpace();
        const rightValue = parse(stream);
        if (!rightValue) {
            stream.throw('Expected right-hand value');
        }

        return maybeBinary({
            type: 'binary-expression',
            right: maybeBinary(rightValue, stream, parse, pr),
            operator,
            left
        } as BinaryExpression, stream, parse, base);
    }

    stream.pop();
    return left;
}

export const parseBinaryExpression = maybe<BinaryExpression | UnaryExpression>((stream: TokenStream) => {
    if (!stream.optional(false, 'punc', '(')) {
        return null;
    }

    const parse = combine<BinaryExpressionValue | null>(
        parseUnaryExpression,
        parseBinaryExpression,
        parseMemberExpression,
        parseLiteral,
        parseNumber,
        parseIdentifier
    );

    const left = parse(stream);
    if (!left) {
        return null;
    }


    // Parse binary expression
    const bex = maybeBinary(left, stream, parse);
    if (bex.type !== 'binary-expression' && bex.type !== 'unary-expression') {
        stream.throw('Expected binary expression.');
    }

    stream.expect(false, 'punc', ')');
    return bex;
});
