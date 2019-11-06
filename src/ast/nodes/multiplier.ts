import {Token}      from '../../tokenizer';
import expect       from '../tools/expect';
import maybe        from '../tools/maybe';
import optional     from '../tools/optional';
import {Multiplier} from '../types';

const types = {
    '*': 'zero-infinity',
    '+': 'one-infinity',
    '?': 'optional'
};

module.exports = maybe<Multiplier | null>(stream => {
    const mp = optional(stream, 'punc', '*', '+', '?', '{');

    if (mp && mp.value === '{') {
        const start = expect(stream, 'num') as Token;
        expect(stream, 'punc', ',');

        const end = expect(stream, 'num') as Token;
        if (start.value < 0 || end.value < 0) {
            return stream.throwError('Range values cannot contain negative values.');
        } else if ((end.value as number) - (start.value as number) < 0) { // TODO: That's ugly
            return stream.throwError('The difference between start and end-value cannot be negative or zero.');
        }

        expect(stream, 'punc', '}');
        return {
            type: 'range',
            value: {
                start: start.value,
                end: end.value
            }
        };
    }

    return mp ? {
        type: types[mp.value],
        value: mp.value
    } as Multiplier : null;
});
