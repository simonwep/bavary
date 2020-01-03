import {TokenStream}     from '../../tokenizer/stream/token-stream';
import {parseIdentifier} from '../internal';
import {maybe}           from '../tools/maybe';
import {optional}        from '../tools/optional';
import {Tag}             from '../types';

export const parseTag = maybe<Tag>((stream: TokenStream) => {
    if (!optional(stream, true, 'punc', '#')) {
        return null;
    }

    const ident = parseIdentifier(stream);
    if (!ident) {
        stream.throwError('Expected identifier');
    }

    return {
        type: 'tag',
        value: ident.value
    };
});
