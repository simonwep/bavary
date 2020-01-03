import {TokenStream} from '../../tokenizer/stream/token-stream';
import {maybe}       from '../tools/maybe';
import {optional}    from '../tools/optional';

/**
 * Parses a spread-operator
 * @type {Function}
 */
export const parseSpreadOperator = maybe<boolean>((stream: TokenStream) => {
    for (let i = 0; i < 3; i++) {
        if (!optional(stream, false, 'punc', '.')) {
            return false;
        }
    }

    return true;
});
