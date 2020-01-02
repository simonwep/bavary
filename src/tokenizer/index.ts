import {Streamable} from '../streamable';
import {Token}      from './types';
import {cmt}        from './types/cmt';
import {kw}         from './types/kw';
import {num}        from './types/num';
import {punc}       from './types/punc';
import {str}        from './types/str';
import {ws}         from './types/ws';

const parser = [
    cmt,
    ws,
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
export const tokenize = (str: string): Array<Token> => {
    const stream = new Streamable(str);
    const tokens: Array<Token> = [];

    /* eslint-disable no-labels */
    outer: while (stream.hasNext()) {

        // Find matching parser
        for (const parse of parser) {
            const start = stream.index;
            const parsed = parse(stream);

            if (!parsed) {
                continue;
            }

            // There may be a comment between whitespace, concatenate that
            if (parsed.type === 'ws' && tokens.length && tokens[tokens.length - 1].type === 'ws') {
                const last = tokens[tokens.length - 1];
                last.value += parsed.value as string;
                last.end = stream.index;
                continue outer;
            }

            tokens.push({
                ...parsed,
                start,
                end: stream.index
            } as Token);

            continue outer;
        }

        // Same problem as in types/punc.ts
        /* istanbul ignore next */
        throw new Error('Failed to parse input sequence.');
    }

    return tokens;
};

