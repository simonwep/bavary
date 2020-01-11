import {TokenStream} from '../../tokenizer/token-stream';
import {maybe}       from '../tools/maybe';
import {Num}         from '../types';

export const parseNumber = maybe<Num>((stream: TokenStream) => {
    const num = stream.optional(false, 'num');

    return num ? {
        type: 'number',
        value: num as number
    } as Num : null;
});
