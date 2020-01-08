import {TokenStream}        from '../../../tokenizer/stream/token-stream';
import {maybe}              from '../../tools/maybe';
import {ValueAccessor}      from '../../types';
import {parseValueAccessor} from '../value-accessor';

export const instanceValueAccessor = maybe<ValueAccessor>((stream: TokenStream) => {

    // They start with a tag...
    if (!stream.optional(false, 'punc', '$')) {
        return null;
    }

    return {
        type: 'value-accessor',
        value: parseValueAccessor(stream)?.value || []
    } as ValueAccessor;
});
