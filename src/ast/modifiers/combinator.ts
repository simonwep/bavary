import {TokenStream} from '../../tokenizer/stream/token-stream';
import {maybe}       from '../tools/maybe';
import {optional}    from '../tools/optional';

export const parseCombinator = maybe<string>((stream: TokenStream) => {
    let combinator = optional(stream, false, 'punc', '|', '&');

    if (!combinator) {
        return null;
    }

    // It may be a extended combinator
    if (combinator === '&' && optional(stream, false, 'punc', '&')) {
        combinator += '&';
    }

    return combinator as string;
});
