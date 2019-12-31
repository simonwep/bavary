import {TokenStream}         from '../../../misc/token-stream';
import {expect}              from '../../tools/expect';
import {maybe}               from '../../tools/maybe';
import {optional}            from '../../tools/optional';
import {skipWhitespace}      from '../../tools/skip-whitespace';
import {Modifier, Modifiers} from '../../types';
import {parseDefineModifier} from './def';
import {parseDeleteModifier} from './del';

const parsers: {
    [key: string]: (stream: TokenStream) => Modifier;
} = {
    def: parseDefineModifier,
    del: parseDeleteModifier
};

/**
 * Parses a lookup-sequence
 * @type {Function}
 */
export const parseModification = maybe<Modifiers | null>(stream => {
    if (!optional(stream, true, 'punc', '{')) {
        return null;
    }

    const set: Modifiers = [];

    // Parse key-value combies
    do {
        const op = optional(stream, false, 'kw', 'def', 'del');

        if (!op) {
            stream.throwError('Expected operator');
        } else {
            skipWhitespace(stream);
            set.push(parsers[op](stream));
        }

        // Pairs are seperated via a comma
    } while (optional(stream, false, 'punc', ','));

    expect(stream, false, 'punc', '}');
    return set;
});
