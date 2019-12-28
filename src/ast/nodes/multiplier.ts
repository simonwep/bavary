import {RawType}    from '../../tokenizer/types';
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

    if (mp && mp.value === '{') {
        const start = expect(stream, false, 'num');

        expect(stream, false, 'punc', ',');
        const end = optional(stream, false, 'num') as RawType;

        if (end) {

            // Validate range - tokenizer currently parses no negaive numbers
            if ((end.value as number) - (start.value as number) < 0) {
                stream.throwError('The difference between start and end-value cannot be negative or zero.');
            }
        }

        expect(stream, false, 'punc', '}');
        return {
            type: 'range',
            value: {
                start: start.value,
                end: end?.value || -1
            }
        } as Multiplier;
    }

    return mp ? {
        type: types[mp.value],
        value: mp.value
    } as Multiplier : null;
});
