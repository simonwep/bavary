import {TokenStream} from '../../tokenizer/stream/token-stream';
import {maybe}       from '../tools/maybe';
import {optional}    from '../tools/optional';
import {Num}         from '../types';

export const parseNumber = maybe<Num>((stream: TokenStream) => {
    const num = optional(stream, false, 'num');

    return num ? {
        type: 'number',
        value: num as number
    } as Num : null;
});
