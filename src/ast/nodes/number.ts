import {TokenStream} from '../../tokenizer/token-stream';
import {maybe}       from '../tools/maybe';
import {Numeral}     from '../types';

export const parseNumber = maybe<Numeral>((stream: TokenStream) => {
    const num = stream.optional('num');

    return num !== null ? {
        type: 'number',
        value: num
    } as Numeral : null;
});
