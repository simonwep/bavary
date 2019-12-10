import {TokenStream}         from '../../../misc/token-stream';
import {expect}              from '../../tools/expect';
import {maybe}               from '../../tools/maybe';
import {optional}            from '../../tools/optional';
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
module.exports = maybe<Modifiers | null>(stream => {
    if (!optional(stream, 'punc', '{')) {
        return null;
    }

    const set: Modifiers = [];

    // Parse key-value combies
    do {
        const op = optional(stream, 'kw', 'def', 'del');

        if (!op) {
            stream.throwError('Expected operator');
        } else {
            set.push(parsers[op.value](stream));
        }

        // Pairs are seperated via a comma
    } while (optional(stream, 'punc', ','));

    expect(stream, 'punc', '}');
    return set;
});
