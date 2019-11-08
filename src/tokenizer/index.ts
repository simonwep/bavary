import Streamable     from '../stream';
import consume        from './tools/consume';
import {isWhiteSpace} from './tools/is';
import {Token}        from './types';
import kw             from './types/kw';
import num            from './types/num';
import punc           from './types/punc';
import str            from './types/str';

const parser = [
    str,
    kw,
    num,
    punc
];

/**
 * Parses a sequence of characters into a list of processable tokens
 * @param str
 * @returns {[]}
 */
export default (str: string): Array<Token> => {
    const stream = new Streamable(str);
    const tokens: Array<Token> = [];

    /* eslint-disable no-labels */
    outer: while (stream.hasNext()) {

        // Ignore whitespace
        consume(stream, isWhiteSpace);

        if (!stream.hasNext()) {
            break;
        }

        // Find matching parser
        for (const parse of parser) {
            const start = stream.index;
            const parsed = parse(stream);

            if (!parsed) {
                continue;
            }

            // Check if token could be the beginning of a comment
            if (parsed.value === '/' && stream.hasNext() && stream.peek() === '/') {
                while (stream.hasNext()) {
                    if (stream.peek() === '\n') {
                        break;
                    }

                    stream.next();
                }

                continue outer;
            }

            tokens.push({
                ...parsed,
                start,
                end: stream.index
            } as Token);

            continue outer;
        }

        throw 'Failed to parse input sequence.';
    }

    return tokens;
};

