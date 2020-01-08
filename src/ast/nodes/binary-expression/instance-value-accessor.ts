import {TokenStream}        from '../../../tokenizer/stream/token-stream';
import {maybe}              from '../../tools/maybe';
import {ValueAccessor}      from '../../types';
import {parseValueAccessor} from '../value-accessor';

export const parseInstanceValueAccessor = maybe<ValueAccessor>((stream: TokenStream) => {

    // They start with a tag...
    if (!stream.optional(false, 'punc', '$')) {
        return null;
    }

    const accessor = parseValueAccessor(stream);
    if (!accessor) {
        stream.throwError('Expected value accessor.');
    }

    return {
        type: 'value-accessor',
        value: accessor.value
    } as ValueAccessor;
});
