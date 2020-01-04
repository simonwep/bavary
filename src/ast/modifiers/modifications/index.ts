import {TokenStream}         from '../../../tokenizer/stream/token-stream';
import {maybe}               from '../../tools/maybe';
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
export const parseModification = maybe<Modifiers | null>((stream: TokenStream) => {
    if (!stream.optional(true, 'punc', '{')) {
        return null;
    }

    const set: Modifiers = [];

    // Parse key-value combies
    do {
        const op = stream.optional(false, 'kw', 'def', 'del');

        if (!op) {
            stream.throwError('Expected operator');
        } else {
            stream.consumeSpace();
            set.push(parsers[op](stream));
        }

        // Pairs are seperated via a comma
    } while (stream.optional(false, 'punc', ','));

    stream.expect(false, 'punc', '}');
    return set;
});
