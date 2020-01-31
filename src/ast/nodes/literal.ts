import {TokenStream}                              from '../../tokenizer/token-stream';
import {combine}                                  from '../tools/combine';
import {maybe}                                    from '../tools/maybe';
import {Literal, LiteralValues, MemberExpression} from '../types';
import {parseMemberExpression}                    from './member-expression';

export const parseLiteral = maybe<Literal>((stream: TokenStream) => {
    const escapeChar = stream.optional('punc', '\'', '"');

    if (!escapeChar) {
        return null;
    }

    // Build string char-by-char
    const values: LiteralValues = [];
    const parseInterpolation = combine<MemberExpression | Literal | null>(
        parseMemberExpression,
        parseLiteral
    );

    while (stream.hasNext()) {
        const {type, value} = stream.next();

        if (type === 'str') {
            values.push({
                type: 'string-litereal',
                value: value as string
            });

        } else if (value === '{') {

            // Parse interpolated value
            while (!stream.match('punc', '}')) {
                const inner = parseInterpolation(stream);

                if (!inner) {
                    break;
                }

                values.push(inner);
            }

            stream.expect('punc', '}');
        } else if (value === escapeChar) {
            break;
        }
    }

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
