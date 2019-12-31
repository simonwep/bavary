import {expect}     from '../tools/expect';
import {maybe}      from '../tools/maybe';
import {optional}   from '../tools/optional';
import {Multiplier} from '../types';

const types: {[key: string]: string} = {
    '*': 'zero-infinity',
    '+': 'one-infinity',
    '?': 'optional'
};

export const parseMultiplier = maybe<Multiplier>(stream => {
    const mp = optional(stream, false, 'punc', '*', '+', '?', '{');

    if (mp === '{') {
        const start = expect(stream, false, 'num');

        expect(stream, false, 'punc', ',');
        const end = optional(stream, false, 'num');

        if (end !== null) {

            // Validate range - tokenizer currently parses no negaive numbers
            if ((end as number) - (start as number) < 0) {
                stream.throwError('The difference between start and end-value cannot be negative or zero.');
            }
        }

        expect(stream, false, 'punc', '}');
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
