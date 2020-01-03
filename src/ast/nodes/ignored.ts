import {TokenStream} from '../../tokenizer/stream/token-stream';
import {parseGroup}  from '../internal';
import {expect}      from '../tools/expect';
import {maybe}       from '../tools/maybe';
import {optional}    from '../tools/optional';
import {Ignored}     from '../types';

/**
 * Parses a group which will later be ignored in the final result
 */
export const parseIgnored = maybe<Ignored>((stream: TokenStream) => {
    if (!optional(stream, false, 'punc', '/')) {
        return null;
    }

    // The ignored statement accepts exactly one argument
    const group = parseGroup(stream);
    if (!group) {
        stream.throwError('Expected group.');
    }

    expect(stream, false, 'punc', '/');
    return {
        type: 'ignored',
        value: group
    } as Ignored;
});
