import {TokenStream} from '../../tokenizer/token-stream';
import {maybe}       from '../tools/maybe';
import {Multiplier}  from '../types';

const types: {[key: string]: string} = {
    '*': 'zero-infinity',
    '+': 'one-infinity',
    '?': 'optional'
};

export const parseMultiplier = maybe<Multiplier>((stream: TokenStream) => {
    const mp = stream.optional('punc', '*', '+', '?', '{');

    if (mp === '{') {
        const start = stream.expect('num');

        stream.expect('punc', ',');
        const end = stream.optional('num');

        if (end !== null) {

            // Validate range - tokenizer currently parses no negaive numbers
            if ((end) - (start) < 0) {
                stream.throw('The difference between start and end-value cannot be negative or zero.');
            }
        }

        stream.expect('punc', '}');
        return {
            type: 'range',
            value: {
                start, end
            }
        } as Multiplier;
    }

    return mp ? {
        type: types[mp],
        value: mp
    } as Multiplier : null;
});
