import {TokenStream} from '../../tokenizer/stream/token-stream';
import {maybe}       from '../tools/maybe';

/**
 * Parses a spread-operator
 * @type {Function}
 */
export const parseSpreadOperator = maybe<boolean>((stream: TokenStream) => {
    for (let i = 0; i < 3; i++) {
        if (!stream.optional(false, 'punc', '.')) {
            return false;
        }
    }

    return true;
});
