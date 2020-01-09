import {TokenStream}   from '../../../tokenizer/stream/token-stream';
import {parseGroup}    from '../../internal';
import {maybe}         from '../../tools/maybe';
import {VoidStatement} from '../../types';

/**
 * Parses a group which will later be ignored in the final result
 */
export const parseVoidStatement = maybe<VoidStatement>((stream: TokenStream) => {

    // The ignored statement accepts exactly one argument
    const value = parseGroup(stream);
    if (!value) {
        stream.throwError('Expected a group-value or a group.');
    }

    return {
        type: 'ignored',
        value
    } as VoidStatement;
});
