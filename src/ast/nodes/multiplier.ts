import {TokenStream} from '../../tokenizer/stream/token-stream';
import {maybe}       from '../tools/maybe';
import {Multiplier}  from '../types';

const types: {[key: string]: string} = {
    '*': 'zero-infinity',
    '+': 'one-infinity',
    '?': 'optional'
};

export const parseMultiplier = maybe<Multiplier>((stream: TokenStream) => {
    const mp = stream.optional(true, 'punc', '*', '+', '?', '{');

    if (mp === '{') {
        const start = stream.expect(false, 'num');

        stream.expect(false, 'punc', ',');
        const end = stream.optional(false, 'num');

        if (end !== null) {

            // Validate range - tokenizer currently parses no negaive numbers
            if ((end as number) - (start as number) < 0) {
                stream.throwError('The difference between start and end-value cannot be negative or zero.');
            }
        }

        stream.expect(false, 'punc', '}');
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
