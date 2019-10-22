const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const mp = optional(stream, 'punc', '*', '+', '?', '!', '{');

    if (mp && mp.value === '{') {
        const start = expect(stream, 'num');
        expect(stream, 'punc', ',');

        const end = expect(stream, 'num');
        if (start.value < 0 || end.value < 0) {
            stream.throwError('Range values cannot contain negative values.');
        } else if (end.value - start.value < 0) {
            stream.throwError('The difference between start and end-value cannot be negative or zero.');
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
        type: 'single',
        value: mp.value
    } : null;
});