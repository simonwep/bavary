import {Streamable} from '../streams/streamable';
import {Token}      from './types';
import {ignored}    from './types/ignored';
import {kw}         from './types/kw';
import {num}        from './types/num';
import {punc}       from './types/punc';
import {str}        from './types/str';

const parsers = [
    str,
    punc,
    kw,
    num
];

/**
 * Parses a sequence of characters into a list of processable tokens
 * @param str
 * @returns {[]}
 */
export const tokenize = (str: string): Array<Token> => {
    const stream = new Streamable(str);
    const tokens: Array<Token> = [];

    const next = (): boolean => {

        // Ignore leading whitespace and comments
        ignored(stream);

        for (const parse of parsers) {
            stream.stash();

            if (parse(stream, tokens, next)) {
                stream.recycle();

                // Ignore trailing whitespace and comments
                ignored(stream);
                return true;
            }

            stream.pop();
        }

        return false;
    };

    /* eslint-disable no-labels */
    while (stream.hasNext()) {

        // Find matching parser
        if (!next()) {
            stream.throw('Failed to parse input sequence.');
        }
    }

    return tokens;
};

