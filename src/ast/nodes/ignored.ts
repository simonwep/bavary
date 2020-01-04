import {TokenStream} from '../../tokenizer/stream/token-stream';
import {parseGroup}  from '../internal';
import {maybe}       from '../tools/maybe';
import {Ignored}     from '../types';

/**
 * Parses a group which will later be ignored in the final result
 */
export const parseIgnored = maybe<Ignored>((stream: TokenStream) => {
    if (!stream.optional(false, 'punc', '/')) {
        return null;
    }

    // The ignored statement accepts exactly one argument
    const group = parseGroup(stream);
    if (!group) {
        stream.throwError('Expected group.');
    }

    stream.expect(false, 'punc', '/');
    return {
        type: 'ignored',
        value: group
    } as Ignored;
});
