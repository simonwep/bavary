import {RawType}    from '../../tokenizer/types';
import expect       from '../tools/expect';
import maybe        from '../tools/maybe';
import optional     from '../tools/optional';
import {Multiplier} from '../types';

const types: {[key: string]: string} = {
    '*': 'zero-infinity',
    '+': 'one-infinity',
    '?': 'optional'
};

module.exports = maybe<Multiplier | null>(stream => {
    const mp = optional(stream, 'punc', '*', '+', '?', '{');

    if (mp && mp.value === '{') {
        const start = expect(stream, 'num') as RawType;

        expect(stream, 'punc', ',');
        const end = expect(stream, 'num') as RawType;

        // Validate range - tokenizer currently parses no negaive numbers
        if ((end.value as number) - (start.value as number) < 0) {
            stream.throwError('The difference between start and end-value cannot be negative or zero.');
        }

        expect(stream, 'punc', '}');
        return {
            type: 'range',
            value: {
                start: start.value,
                end: end.value
            }
        } as Multiplier;
    }

    return mp ? {
        type: types[mp.value],
        value: mp.value
    } as Multiplier : null;
});
