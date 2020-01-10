import {TokenStream} from '../../tokenizer/stream/token-stream';
import {maybe}       from '../tools/maybe';

export const parseCombinator = maybe<string>((stream: TokenStream) => {
    let combinator = stream.optional(false, 'punc', '|', '&');

    if (!combinator) {
        return null;
    }

    // It may be a extended combinator
    if (combinator === '&' && stream.optional(false, 'punc', '&')) {
        combinator += '&';
    }

    return combinator;
});
