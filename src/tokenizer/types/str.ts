import {Streamable}         from '../../streams/streamable';
import {Token, TokenParser} from '../types';
import {punc}               from './punc';

export const str: TokenParser = (stream: Streamable<string>, tokens: Array<Token>, next): boolean => {
    const sign = stream.peek();

    if (sign !== '\'' && sign !== '"') {
        return false;
    }

    punc(stream, tokens, next);
    let start = stream.index;
    let escaped = false;
    let str = '';

    for (; ;) {
        if (!stream.hasNext()) {
            stream.throw('String litereal not terminated.');
        }

        const ch = stream.peek() as string;

        if (ch === '\n') {
            stream.throw('Expected end of string.');
        }

        if (escaped) {
            escaped = false;
        } else if (ch === '\\' && !escaped) {
            escaped = true;
            stream.next();
            continue;
        } else if (ch === '{') {

            // Push current string
            tokens.push({
                type: 'str',
                value: str,
                start,
                end: stream.index
            } as Token);

            // Read open bracket
            next();

            // Read content of interpolation
            do {
                if (!next()) {
                    stream.throw('Expected }');
                }
            } while (tokens[tokens.length - 1].value !== '}');

            // Reset start index
            start = stream.index;

            // Clear current string
            str = '';

            // Continue reading next string sequence
            continue;
        } else if (ch === sign) {
            break;
        }

        str += ch;
        stream.next();
    }

    // Push dangling string if not empty
    if (str.length) {
        tokens.push({
            type: 'str',
            value: str,
            start,
            end: stream.index
        });
    }

    // Read closing quotation character
    punc(stream, tokens, next);

    return true;
};
