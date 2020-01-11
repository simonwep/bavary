import {TokenStream}                from '../../tokenizer/token-stream';
import {parseGroup, parseReference} from '../internal';
import {maybe}                      from '../tools/maybe';
import {Spread}                     from '../types';

export const parseSpread = maybe<Spread>((stream: TokenStream) => {

    // Skip leading whitespace
    stream.consumeSpace();

    // Three dots indicate a spread-operation
    for (let i = 0; i < 3; i++) {
        if (!stream.optional(true, 'punc', '.')) {
            return null;
        }
    }

    // Either a group or reference must follow
    const value = parseGroup(stream) || parseReference(stream);
    if (!value) {
        stream.throw('Expected group or reference.');
    }

    return {
        type: 'spread',
        value
    } as Spread;
});
