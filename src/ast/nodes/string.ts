import {TokenStream}            from '../../tokenizer/token-stream';
import {maybe}                  from '../tools/maybe';
import {Literal, LiteralValues} from '../types';
import {parseValueAccessor}     from './value-accessor';

export const parseString = maybe<Literal>((stream: TokenStream) => {
    const escapeChar = stream.optional(false, 'punc', '\'', '"');

    if (!escapeChar) {
        return null;
    }

    // Build string char-by-char
    const values: LiteralValues = [];
    let currentRawString = '';
    let escaped = false;

    // TODO: Performance issue?
    const dumpRawString = (): void => {
        if (currentRawString.length) {
            values.push({
                type: 'raw-literal',
                value: currentRawString
            });

            currentRawString = '';
        }
    };

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
            // TODO: Allow multiple values?
            const inner = parseValueAccessor(stream);

            if (!inner) {
                stream.throw('Expected literal, value-accessor or group.');
            }

            values.push(inner);
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
        (values.length === 1 && values[0].type === 'raw-literal' && !values[0].value)
    ) {
        stream.throw('Strings shouldn\'t be empty.');
    }

    return {
        type: 'literal',
        value: values
    } as Literal;
});
