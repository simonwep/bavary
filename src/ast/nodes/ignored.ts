import {TokenStream}                                                     from '../../tokenizer/stream/token-stream';
import {parseCharacterSelecton, parseGroup, parseReference, parseString} from '../internal';
import {combine}                                                         from '../tools/combine';
import {maybe}                                                           from '../tools/maybe';
import {Group, GroupValue, Ignored}                                      from '../types';

/**
 * Parses a group which will later be ignored in the final result
 */
export const parseIgnored = maybe<Ignored>((stream: TokenStream) => {
    if (!stream.optional(false, 'punc', '/')) {
        return null;
    }

    // The ignored statement accepts exactly one argument
    const value = combine<GroupValue | null>(
        parseGroup,
        parseReference,
        parseCharacterSelecton,
        parseString
    )(stream);

    if (!value) {
        stream.throwError('Expected a group-value or a group.');
    }

    stream.expect(false, 'punc', '/');
    return {
        type: 'ignored',
        value: {
            type: 'group',
            multiplier: null,
            value: [value]
        } as Group
    } as Ignored;
});
