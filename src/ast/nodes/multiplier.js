const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const mp = optional(stream, 'punc', '*', '+', '?', '!', '{');

    if (mp && mp.value === '{') {
        const start = optional(stream, 'num');

        if (!start || !optional(stream, 'punc', ',')) {
            throw 'Syntax error.';
        }

        const end = optional(stream, 'num');
        if (!end) {
            throw 'Missing final range argument.';
        } else if (start.value < 0 || end.value < 0) {
            throw 'Range values cannot contain negative values.';
        } else if (end.value - start.value < 0) {
            throw 'Start value cannot be higher than the end value.';
        } else if (!optional(stream, 'punc', '}')) {
            throw 'Expected }.'; // TODO: expect util?
        }

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
