import {TokenStream}                              from '../../tokenizer/token-stream';
import {combine}                                  from '../tools/combine';
import {maybe}                                    from '../tools/maybe';
import {Literal, LiteralValues, MemberExpression} from '../types';
import {parseMemberExpression}                    from './member-expression';

export const parseLiteral = maybe<Literal>((stream: TokenStream) => {
    const escapeChar = stream.optional(false, 'punc', '\'', '"');

    if (!escapeChar) {
        return null;
    }

    // Build string char-by-char
    const values: LiteralValues = [];
    let currentRawString = '';
    let escaped = false;

    function dumpRawString(): void {
        if (currentRawString.length) {
            values.push({
                type: 'string-litereal',
                value: currentRawString
            });

            currentRawString = '';
        }
    }

    const parseInterpolation = combine<MemberExpression | Literal | null>(
        parseMemberExpression,
        parseLiteral
    );

    while (stream.hasNext(true)) {
        const {value} = stream.next(true);

        // End reached
        if (value === escapeChar && !escaped) {
            dumpRawString();
            break;
        }

        // Interpolation
        if (value === '{' && !escaped) {

            // Dump current raw string
            if (currentRawString.length) {
                dumpRawString();
            }

            // Parse interpolated value
            while (!stream.match(false, 'punc', '}')) {
                const inner = parseInterpolation(stream);

                if (!inner) {
                    break;
                }

                values.push(inner);
            }


            stream.expect(false, 'punc', '}');
            continue;
        }

        // Maybe the escape-character was escaped :O
        const wasEscaped = escaped;
        escaped = value === '\\';

        // Ignore escape-slash if not escaped
        if (!escaped || wasEscaped) {
            currentRawString += value;
        }
    }

    dumpRawString();

    // Throw error on empty strings, their mostly a error
    if (
        !values.length ||
        (values.length === 1 && values[0].type === 'string-litereal' && !values[0].value)
    ) {
        stream.throw('Strings shouldn\'t be empty.');
    }

    return {
        type: 'literal',
        value: values
    } as Literal;
});
